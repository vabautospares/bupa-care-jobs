import type { TextareaHTMLAttributes } from "react";

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  rows?: number;
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  rows = 3,
  className = "",
  ...props
}: TextAreaFieldProps) {
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? descriptionId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="label">
        {label}
        {props.required && (
          <span aria-hidden="true" className="ml-1 text-[var(--color-danger)]">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={descriptionId} className="text-sm leading-6 text-[var(--color-muted)]">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`input ${error ? "input-error" : ""} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm font-semibold text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
}