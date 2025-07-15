"use client";

import Link from "next/link";
import Image from "next/image";
import { highlight } from "sugar-high";
import React from "react";
import { ClientMDXComponent } from "./mdx-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../../components/ui/tooltip";

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
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
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

// Simple footnote tooltip component
function FootnoteTooltip({ number, content }: { number: number; content: string }) {
  // Clean up the content
  const cleanContent = content
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <sup className="footnote-ref">
          <button
            className="footnote-tooltip-trigger text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:bg-blue-100 dark:focus:bg-blue-900/30 px-1.5 py-0.5 rounded-md text-sm font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label={`Show footnote ${number}`}
            type="button"
          >
            {number}
          </button>
        </sup>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="footnote-tooltip-content max-w-xs bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 z-[60] text-sm leading-relaxed p-4 shadow-2xl rounded-lg border border-gray-600 dark:border-gray-300"
      >
        {cleanContent}
      </TooltipContent>
    </Tooltip>
  );
}

// Parse footnotes from content
function parseFootnotes(content: string) {
  const footnotes: Array<{ number: number; content: string }> = [];
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
    let currentFootnote: { number: number; content: string } | null = null;

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

export function CustomMDX(props) {
  const { source, components: customComponents = {}, ...otherProps } = props;

  // Parse footnotes from source
  const { footnotes, contentWithoutFootnotes } = parseFootnotes(source);

  // Create footnote lookup map
  const footnoteMap = React.useMemo(() => {
    const map = new Map();
    footnotes.forEach((footnote) => {
      map.set(footnote.number, footnote.content);
    });
    return map;
  }, [footnotes]);

  // Process content to replace footnote references
  let processedContent = contentWithoutFootnotes;
  footnotes.forEach((footnote) => {
    const refPattern = new RegExp(`\\[${footnote.number}\\]`, "g");
    processedContent = processedContent.replace(
      refPattern,
      `<FootnoteTooltipRef number={${footnote.number}} />`,
    );
  });

  const enhancedComponents = {
    ...components,
    ...customComponents,
    FootnoteTooltipRef: ({ number }: { number: number }) => {
      const content = footnoteMap.get(number) || "";
      return <FootnoteTooltip number={number} content={content} />;
    },
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="mdx-with-footnote-tooltips">
        <div className="mdx-content">
          <ClientMDXComponent
            source={processedContent}
            components={enhancedComponents}
            {...otherProps}
          />
        </div>

        {/* Hidden footnote section for accessibility and print */}
        {footnotes.length > 0 && (
          <section
            className="footnotes-section sr-only print:not-sr-only mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700"
            role="doc-endnotes"
            aria-label="Footnotes"
          >
            <h2 className="footnotes-title text-lg font-semibold mb-4">Footnotes</h2>
            <div className="footnotes-list">
              {footnotes.map((footnote) => (
                <div
                  key={footnote.number}
                  id={`footnote-${footnote.number}`}
                  className="footnote-definition mb-4 flex items-start gap-3"
                  role="doc-endnote"
                >
                  <span className="footnote-number font-medium text-neutral-600 dark:text-neutral-400">
                    {footnote.number}.
                  </span>
                  <div className="footnote-text text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                    {footnote.content}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </TooltipProvider>
  );
}
