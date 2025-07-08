import Link from "next/link";
import Image from "next/image";
import { highlight } from "sugar-high";
import React from "react";
import { ServerMDXComponent } from "./mdx-utils";

function Table({ data }) {
  let headers = data.headers.map((header, index) => <th key={index}>{header}</th>);
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg shadow-sm" {...props} />;
}

function Blockquote({ children }) {
  return (
    <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-6 my-6 italic text-neutral-600 dark:text-neutral-400">
      {children}
    </blockquote>
  );
}

function Hr() {
  return <hr className="border-neutral-300 dark:border-neutral-600 my-8" />;
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children);
  return (
    <code
      className="px-1.5 py-0.5 rounded-md text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium"
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      {...props}
    />
  );
}

function Pre({ children, ...props }) {
  return (
    <pre
      className="bg-neutral-50 dark:bg-neutral-900 rounded-lg overflow-x-auto border border-neutral-200 dark:border-neutral-700 py-4 px-4 text-sm my-6"
      {...props}
    >
      {children}
    </pre>
  );
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children,
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

// Server-side footnote reference component
function FootnoteReference({ id, number }: { id: string; number: string }) {
  return (
    <sup className="footnote-ref">
      <a
        href={`#footnote-${id}`}
        id={`footnote-ref-${id}`}
        className="footnote-link"
        aria-label={`Jump to footnote ${number}`}
        role="doc-noteref"
      >
        {number}
      </a>
    </sup>
  );
}

// Server-side footnote definition component
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
        className="footnote-back-link"
        aria-label={`Return to footnote ${number} reference`}
        role="doc-backlink"
      >
        ↩
      </a>
    </div>
  );
}

// Parse footnotes from content
function parseFootnotes(content: string) {
  const footnotes: Array<{ id: string; number: number; content: string }> = [];
  const lines = content.split("\n");
  let footnoteStartIndex = -1;

  // Find where footnotes start
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "{<hr />}" || line.match(/^\d+\s/)) {
      footnoteStartIndex = i;
      break;
    }
  }

  if (footnoteStartIndex !== -1) {
    const footnoteLines = lines.slice(footnoteStartIndex);
    let currentFootnote: { id: string; number: number; content: string } | null = null;

    footnoteLines.forEach((line) => {
      const trimmedLine = line.trim();

      if (trimmedLine === "{<hr />}") {
        return;
      }

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

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  pre: Pre,
  blockquote: Blockquote,
  hr: Hr,
  Table,
};

export async function CustomMDX(props) {
  const { source, components: customComponents = {}, ...otherProps } = props;

  // Parse footnotes from source
  const { footnotes, contentWithoutFootnotes } = parseFootnotes(source);

  // Process content to replace footnote references
  let processedContent = contentWithoutFootnotes;
  footnotes.forEach((footnote) => {
    const refPattern = new RegExp(`\\[${footnote.number}\\]`, "g");
    processedContent = processedContent.replace(
      refPattern,
      `<FootnoteReference id="${footnote.id.replace("fn-", "")}" number="${footnote.number}" />`,
    );
  });

  const enhancedComponents = {
    ...components,
    ...customComponents,
    FootnoteReference: ({ id, number }: { id: string; number: string }) => (
      <FootnoteReference id={id} number={number} />
    ),
  };

  return (
    <div className="static-footnotes-wrapper">
      <div className="content-with-footnotes">
        <ServerMDXComponent
          source={processedContent}
          components={enhancedComponents}
          {...otherProps}
        />
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

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function enhanceFootnotes() {
                // Add smooth scrolling to footnote links
                document.querySelectorAll('.footnote-link').forEach(function(link) {
                  link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.getElementById(this.getAttribute('href').substring(1));
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      window.history.pushState(null, '', this.getAttribute('href'));
                    }
                  });
                });

                // Add smooth scrolling to footnote back links
                document.querySelectorAll('.footnote-back-link').forEach(function(link) {
                  link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.getElementById(this.getAttribute('href').substring(1));
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      window.history.pushState(null, '', this.getAttribute('href'));
                    }
                  });
                });
              }

              // Run when DOM is ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', enhanceFootnotes);
              } else {
                enhanceFootnotes();
              }
            })();
          `,
        }}
      />
    </div>
  );
}
