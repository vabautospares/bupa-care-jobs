"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const navigationLinks = [
  { label: "Find opportunities", href: "/find-opportunities" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Care careers", href: "/care-careers" },
  { label: "About us", href: "/about" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
] as const;

export function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    // Store the element that had focus before opening
    lastFocusedRef.current = document.activeElement as HTMLElement;

    // Focus the first focusable element in the menu
    const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements?.length) {
      (focusableElements[0] as HTMLElement).focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      // Tab trapping
      if (event.key === "Tab") {
        const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          (lastElement as HTMLElement).focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          (firstElement as HTMLElement).focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && lastFocusedRef.current) {
      // Restore focus to the element that had it before opening
      lastFocusedRef.current.focus();
      lastFocusedRef.current = null;
    }
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav aria-label="Primary" className="flex items-center gap-6">
      <ul className="hidden items-center gap-6 lg:flex">
        {navigationLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`rounded-sm px-1 py-2 text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-foreground)] hover:text-[var(--color-accent)]"
              }`}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/apply"
            className="rounded-sm bg-[var(--color-accent)] px-4 py-2 text-sm font-bold text-[var(--color-accent-contrast)] shadow-sm hover:bg-[var(--color-accent-hover)]"
          >
            Apply now
          </Link>
        </li>
      </ul>

      <button
        ref={closeButtonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-surface-strong)] lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      <div
        ref={menuRef}
        id="mobile-navigation"
        className="absolute inset-x-0 top-16 border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-4 shadow-lg lg:hidden"
        hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <ul className="mx-auto max-w-7xl space-y-1">
          {navigationLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={closeMenu}
                className={`block rounded-sm px-3 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 ${
                  isActive(link.href)
                    ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                    : "text-[var(--color-foreground)] hover:bg-[var(--color-surface-strong)] hover:text-[var(--color-accent)]"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link
              href="/apply"
              className="block rounded-sm bg-[var(--color-accent)] px-3 py-3 text-center text-base font-bold text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
            >
              Apply now
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}