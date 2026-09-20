import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({
  id,
  label,
  hint,
  error,
  className = "",
  ...props
}: TextFieldProps) {
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
      <input
        id={id}
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
