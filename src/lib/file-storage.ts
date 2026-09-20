import type { StoredFileReference } from "@/lib/types";

export interface FileStorageAdapter {
  store(file: File, folder?: string): Promise<StoredFileReference>;
  delete(reference: string): Promise<void>;
}

export interface FileStorageConfig {
  provider: "local" | "s3" | "gcs" | "azure";
  localUploadDir?: string;
  s3?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  gcs?: {
    bucket: string;
    projectId: string;
  };
  azure?: {
    container: string;
    accountName: string;
    accountKey: string;
  };
}

function generateFileId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_");
}

function getNodeModules() {
  if (typeof window !== "undefined") {
    throw new Error("Node modules can only be used on the server");
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto");
  return { fs, path, crypto };
}

export class LocalFileStorage implements FileStorageAdapter {
  private uploadDir: string;

  constructor(uploadDir: string = "./uploads") {
    this.uploadDir = uploadDir;
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists(): void {
    if (typeof window === "undefined") {
      const { fs, path } = getNodeModules();
      const fullPath = path.resolve(this.uploadDir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  }

  async store(file: File, folder: string = "applications"): Promise<StoredFileReference> {
    if (typeof window !== "undefined") {
      throw new Error("LocalFileStorage can only be used on the server");
    }

    const { fs, path } = getNodeModules();

    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const extension = getFileExtension(file.name);
    const sanitizedName = sanitizeFilename(file.name.replace(/\.[^/.]+$/, ""));
    const storedFilename = `${fileId}-${sanitizedName}.${extension}`;

    const folderPath = path.join(this.uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, storedFilename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const stats = fs.statSync(filePath);

    const reference = `local://${folder}/${storedFilename}`;

    return {
      provider: "local",
      reference,
      fileName: file.name,
      contentType: file.type,
      sizeBytes: stats.size,
    };
  }

  async delete(reference: string): Promise<void> {
    if (typeof window !== "undefined") {
      throw new Error("LocalFileStorage can only be used on the server");
    }

    if (!reference.startsWith("local://")) {
      return;
    }

    const { fs, path } = getNodeModules();
    const relativePath = reference.replace("local://", "");
    const filePath = path.join(this.uploadDir, relativePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export class S3FileStorage implements FileStorageAdapter {
  private bucket: string;
  private region: string;
  private s3Client: unknown;

  constructor(config: { bucket: string; region: string; accessKeyId: string; secretAccessKey: string }) {
    this.bucket = config.bucket;
    this.region = config.region;
  }

  async store(file: File, folder: string = "applications"): Promise<StoredFileReference> {
    throw new Error("S3 storage not implemented");
  }

  async delete(_reference: string): Promise<void> {
    // Placeholder for S3 delete
  }
}

export class NotConfiguredFileStorage implements FileStorageAdapter {
  async store(): Promise<StoredFileReference> {
    throw new Error("File storage is not configured. Set FILE_STORAGE_PROVIDER environment variable.");
  }

  async delete(): Promise<void> {
    // No-op
  }
}

function createFileStorage(): FileStorageAdapter {
  const provider = process.env.FILE_STORAGE_PROVIDER || "local";

  switch (provider) {
    case "local":
      return new LocalFileStorage(process.env.FILE_STORAGE_LOCAL_DIR);
    case "s3":
      if (!process.env.AWS_S3_BUCKET || !process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.warn("S3 storage configured but credentials missing, falling back to local");
        return new LocalFileStorage();
      }
      return new S3FileStorage({
        bucket: process.env.AWS_S3_BUCKET!,
        region: process.env.AWS_REGION!,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      });
    default:
      return new NotConfiguredFileStorage();
  }
}

export const fileStorage: FileStorageAdapter = createFileStorage();