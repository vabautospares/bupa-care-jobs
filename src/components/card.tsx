import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-md border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
