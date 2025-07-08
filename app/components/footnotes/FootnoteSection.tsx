import React from "react";
import { useFootnotes } from "./FootnoteProvider";
import { FootnoteDefinition } from "./FootnoteDefinition";

interface FootnoteSectionProps {
  className?: string;
}

export function FootnoteSection({ className = "" }: FootnoteSectionProps) {
  const { getAllFootnotes } = useFootnotes();
  const footnotes = getAllFootnotes();

  if (footnotes.length === 0) {
    return null;
  }

  return (
    <section
      className={`footnotes-section ${className}`}
      role="doc-endnotes"
      aria-label="Footnotes"
    >
      <div className="footnotes-header">
        <h2 className="footnotes-title">Footnotes</h2>
      </div>
      <div className="footnotes-list">
        {footnotes.map((footnote) => (
          <FootnoteDefinition
            key={footnote.id}
            id={footnote.id}
            number={footnote.number}
            className="footnote-definition-item"
          >
            <span dangerouslySetInnerHTML={{ __html: footnote.content }} />
          </FootnoteDefinition>
        ))}
      </div>
    </section>
  );
}
