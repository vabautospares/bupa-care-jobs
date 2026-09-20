"use client";

import { useState, ChangeEvent } from "react";

interface FileUploadFieldProps {
  id: string;
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  onChange: (files: File[]) => void;
  error?: string;
  hint?: string;
  className?: string;
}

export function FileUploadField({
  id,
  name,
  label,
  accept,
  multiple = false,
  onChange,
  error,
  hint,
  className = "",
}: FileUploadFieldProps) {
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPreviewFiles(files);
    onChange(files);
  };

  const removeFile = (index: number) => {
    const newFiles = previewFiles.filter((_, i) => i !== index);
    setPreviewFiles(newFiles);
    onChange(newFiles);
  };

  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? descriptionId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-bold text-[var(--color-foreground)]">
        {label}
        <span aria-hidden="true" className="ml-1 text-[var(--color-danger)]">*</span>
      </label>
      {hint && (
        <p id={descriptionId} className="text-sm leading-6 text-[var(--color-muted)]">
          {hint}
        </p>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="sr-only"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          required
        />
        <label
          htmlFor={id}
          className={`flex flex-col items-center justify-center w-full rounded-sm border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
            error
              ? "border-[var(--color-danger)]"
              : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
          }`}
        >
          <svg
            className="w-8 h-8 text-[var(--color-muted)] mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            Drag & drop files here, or click to select
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            {multiple ? "Multiple files allowed" : "Single file"}
            {accept && ` · Accepted: ${accept}`}
          </p>
        </label>
        {error && (
          <p id={errorId} role="alert" className="text-sm font-semibold text-[var(--color-danger)]">
            {error}
          </p>
        )}
      </div>

      {previewFiles.length > 0 && (
        <ul className="space-y-2" role="list" aria-label="Selected files">
          {previewFiles.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 rounded-sm bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <svg
                  className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                  />
                  <path d="M14 2v6h6" />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--color-foreground)] truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {(file.size / 1024).toFixed(1)} KB · {file.type || "Unknown type"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="ml-2 p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-surface-strong)] transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}