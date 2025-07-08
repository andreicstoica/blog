import React from "react";

interface Footnote {
  id: string;
  number: number;
  content: string;
}

interface SimpleFootnotesProps {
  content: string;
  children: React.ReactNode;
}

function parseFootnotes(content: string) {
  const footnotes: Footnote[] = [];
  const lines = content.split("\n");
  let footnoteStartIndex = -1;

  // Find where footnotes start - look for {<hr />} or numbered footnotes
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "{<hr />}" || line.match(/^\d+\s/)) {
      footnoteStartIndex = i;
      break;
    }
  }

  if (footnoteStartIndex !== -1) {
    const footnoteLines = lines.slice(footnoteStartIndex);
    let currentFootnote: Footnote | null = null;

    footnoteLines.forEach((line) => {
      const trimmedLine = line.trim();

      // Skip the {<hr />} line
      if (trimmedLine === "{<hr />}") {
        return;
      }

      // Match footnote format: "1 content" or "10 content"
      const footnoteMatch = trimmedLine.match(/^(\d+)\s+(.*)$/);
      if (footnoteMatch) {
        if (currentFootnote) {
          footnotes.push(currentFootnote);
        }

        const number = parseInt(footnoteMatch[1], 10);
        currentFootnote = {
          id: `fn-${number}`,
          number,
          content: footnoteMatch[2].trim(),
        };
      } else if (currentFootnote && trimmedLine.length > 0) {
        // This is a continuation of the previous footnote
        currentFootnote.content += " " + trimmedLine;
      }
    });

    if (currentFootnote) {
      footnotes.push(currentFootnote);
    }
  }

  return {
    footnotes: footnotes.sort((a, b) => a.number - b.number),
    contentWithoutFootnotes:
      footnoteStartIndex !== -1 ? lines.slice(0, footnoteStartIndex).join("\n").trim() : content,
  };
}

function FootnoteReference({ id, number }: { id: string; number: number }) {
  return (
    <sup className="footnote-ref">
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

function FootnoteDefinition({
  id,
  number,
  content,
}: {
  id: string;
  number: number;
  content: string;
}) {
  return (
    <div id={`footnote-${id}`} className="footnote-definition" role="doc-endnote">
      <div className="footnote-content">
        <span className="footnote-number" aria-label={`Footnote ${number}`}>
          {number}.
        </span>
        <div className="footnote-text">
          <span dangerouslySetInnerHTML={{ __html: content }} />
        </div>
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

export function SimpleFootnotes({ content, children }: SimpleFootnotesProps) {
  const { footnotes, contentWithoutFootnotes } = parseFootnotes(content);

  // Transform content to replace footnote references with components
  let processedContent = contentWithoutFootnotes;

  footnotes.forEach((footnote) => {
    const refPattern = new RegExp(`\\[${footnote.number}\\]`, "g");
    processedContent = processedContent.replace(
      refPattern,
      `<FootnoteReference id="${footnote.id.replace("fn-", "")}" number={${footnote.number}} />`,
    );
  });

  // Create components map for footnote references
  const footnoteComponents = {
    FootnoteReference: ({ id, number }: { id: string; number: number }) => (
      <FootnoteReference id={id} number={number} />
    ),
  };

  return (
    <div className="simple-footnotes-wrapper">
      <div className="content-with-footnotes">
        {React.cloneElement(children as React.ReactElement, {
          source: processedContent,
          components: {
            ...((children as React.ReactElement).props.components || {}),
            ...footnoteComponents,
          },
        })}
      </div>

      {footnotes.length > 0 && (
        <section className="footnotes-section" role="doc-endnotes" aria-label="Footnotes">
          <div className="footnotes-header">
            <h2 className="footnotes-title">Footnotes</h2>
          </div>
          <div className="footnotes-list">
            {footnotes.map((footnote) => (
              <FootnoteDefinition
                key={footnote.id}
                id={footnote.id}
                number={footnote.number}
                content={footnote.content}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
