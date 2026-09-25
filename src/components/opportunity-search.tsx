"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { jobCategories } from "@/data/homepage";

export function OpportunitySearch() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const initialKeyword = searchParams.get("keyword") ?? "";
  const initialLocation = searchParams.get("location") ?? "";
  const initialCategory = searchParams.get("category") ?? "";
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [message, setMessage] = useState<string>();
  const initializedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    const timeout = window.setTimeout(() => {
      setKeyword(initialKeyword);
      setLocation(initialLocation);
      setCategory(initialCategory);
      setMessage(undefined);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [initialKeyword, initialLocation, initialCategory, queryString]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const trimmedKeyword = String(form.get("keyword") ?? "").trim();
    const trimmedLocation = String(form.get("location") ?? "").trim();
    const selectedCategory = String(form.get("category") ?? "").trim();

    if (!trimmedKeyword && !trimmedLocation && !selectedCategory) {
      setMessage("Enter a job title, keyword or location to start your search.");
      return;
    }

    setMessage(undefined);
    const params = new URLSearchParams();
    if (trimmedKeyword) params.set("keyword", trimmedKeyword);
    if (trimmedLocation) params.set("location", trimmedLocation);
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/find-opportunities?${params.toString()}`);
  };

  return (
    <form
      action="/find-opportunities"
      method="get"
      aria-label="Search care opportunities"
      onSubmit={handleSubmit}
      className="card bg-[var(--color-background)] p-6 shadow-lg sm:p-8 animate-fade-in-up"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Search care opportunities</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Use keywords, location, and category to find your ideal care role.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="hero-keyword" className="label">
            Job title or keyword
          </label>
          <input
            id="hero-keyword"
            name="keyword"
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Care Assistant"
            className="input"
            aria-describedby="keyword-hint"
          />
          <p id="keyword-hint" className="mt-1 text-xs text-[var(--color-muted)]">e.g. Care Assistant, Senior Carer, Nurse</p>
        </div>
        <div>
          <label htmlFor="hero-location" className="label">
            Location
          </label>
          <input
            id="hero-location"
            name="location"
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Town, city or postcode"
            className="input"
            aria-describedby="location-hint"
          />
          <p id="location-hint" className="mt-1 text-xs text-[var(--color-muted)]">e.g. London, Manchester, SW1A</p>
        </div>
        <div>
          <label htmlFor="hero-category" className="label">
            Category
          </label>
          <select
            id="hero-category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="input"
          >
            <option value="">All categories</option>
            {jobCategories.map((cat) => (
              <option key={cat.title} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" size="lg" className="btn btn-primary w-full sm:w-auto py-3.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-1">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          Search jobs
        </Button>
      </div>
      {message && (
        <p role="alert" className="mt-4 text-sm font-medium text-[var(--color-danger)] flex items-center gap-2 animate-fade-in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {message}
        </p>
      )}
    </form>
  );
}