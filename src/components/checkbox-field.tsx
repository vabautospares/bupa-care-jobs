import type { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  error?: string;
}

export function CheckboxField({
  id,
  label,
  description,
  error,
  className = "",
  ...props
}: CheckboxFieldProps) {
  const errorId = `${id}-error`;
  const describedBy = [description ? `${id}-desc` : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className="mt-1 h-5 w-5 rounded-sm border-[var(--color-border)] bg-[var(--color-surface)] accent-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          {...props}
        />
        <div className="space-y-1">
          <label htmlFor={id} className="text-sm font-bold text-[var(--color-foreground)]">
            {label}
          </label>
          {description && (
            <p id={`${id}-desc`} className="text-sm leading-6 text-[var(--color-muted)]">
              {description}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm font-semibold text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
