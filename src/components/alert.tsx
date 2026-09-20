import type { ReactNode } from "react";

type AlertTone = "info" | "success" | "warning" | "error";

interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  className?: string;
}

const toneClasses: Record<AlertTone, string> = {
  info: "border-[var(--color-focus)] bg-[var(--color-focus-soft)] text-[var(--color-foreground)]",
  success: "border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-foreground)]",
  warning: "border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-foreground)]",
  error: "border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-foreground)]",
};

export function Alert({ tone = "info", title, children, className = "" }: AlertProps) {
  return (
    <div
      role={tone === "info" ? undefined : "alert"}
      className={`rounded-sm border-l-4 p-4 ${toneClasses[tone]} ${className}`}
    >
      {title && <h2 className="mb-1 font-bold">{title}</h2>}
      <div className="text-sm leading-6">{children}</div>
    </div>
  );
}
