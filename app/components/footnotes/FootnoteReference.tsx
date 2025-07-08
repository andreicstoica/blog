"use client";

import React from "react";

interface FootnoteReferenceProps {
  id: string;
  number: number;
  className?: string;
}

export function FootnoteReference({ id, number, className = "" }: FootnoteReferenceProps) {
  return (
    <sup className={`footnote-ref ${className}`}>
      <a
        href={`#footnote-${id}`}
        id={`footnote-ref-${id}`}
        className="footnote-link"
        aria-label={`Jump to footnote ${number}`}
        role="doc-noteref"
        onClick={(e) => {
          e.preventDefault();
          const target = document.getElementById(`footnote-${id}`);
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            // Add a brief highlight effect
            target.classList.add("footnote-highlight");
            setTimeout(() => {
              target.classList.remove("footnote-highlight");
            }, 2000);
          }
        }}
      >
        {number}
      </a>
    </sup>
  );
}
