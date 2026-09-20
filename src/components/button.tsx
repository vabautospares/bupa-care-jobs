import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-accent-contrast)] shadow-sm hover:bg-[var(--color-accent-hover)]",
  secondary:
    "border border-[var(--color-accent)] bg-[var(--color-background)] text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]",
  quiet:
    "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-surface-strong)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-sm font-bold transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
