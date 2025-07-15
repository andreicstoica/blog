import React from "react";

interface FootnoteData {
  id: string;
  content: string;
}

interface FootnotesProps {
  footnotes: FootnoteData[];
}

export function Footnotes({ footnotes }: FootnotesProps) {
  if (!footnotes || footnotes.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-700">
      <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">
        Footnotes
      </h2>
      <ol className="space-y-3">
        {footnotes.map((footnote) => (
          <li
            key={footnote.id}
            id={`footnote-${footnote.id}`}
            className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed"
          >
            <span className="font-medium text-neutral-900 dark:text-neutral-100 mr-2">
              {footnote.id}.
            </span>
            <span dangerouslySetInnerHTML={{ __html: footnote.content }} />
            <a
              href={`#footnote-ref-${footnote.id}`}
              className="ml-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
              aria-label={`Go back to footnote ${footnote.id} reference`}
            >
              ↩
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
