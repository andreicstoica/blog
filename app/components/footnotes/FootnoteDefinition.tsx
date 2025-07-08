import React from "react";

interface FootnoteDefinitionProps {
  id: string;
  number: number;
  children: React.ReactNode;
  className?: string;
}

export function FootnoteDefinition({
  id,
  number,
  children,
  className = "",
}: FootnoteDefinitionProps) {
  return (
    <div id={`footnote-${id}`} className={`footnote-definition ${className}`} role="doc-endnote">
      <div className="footnote-content">
        <span className="footnote-number" aria-label={`Footnote ${number}`}>
          {number}.
        </span>
        <div className="footnote-text">{children}</div>
      </div>
      <a
        href={`#footnote-ref-${id}`}
        onClick={(e) => {
          e.preventDefault();
          const target = document.getElementById(`footnote-ref-${id}`);
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            // Add a brief highlight effect
            target.classList.add("footnote-ref-highlight");
            setTimeout(() => {
              target.classList.remove("footnote-ref-highlight");
            }, 2000);
          }
        }}
        className="footnote-back-link"
        aria-label={`Return to footnote ${number} reference`}
        role="doc-backlink"
      >
        ↩
      </a>
    </div>
  );
}
