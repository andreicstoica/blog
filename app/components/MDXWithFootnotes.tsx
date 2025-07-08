"use client";

import React, { useMemo } from "react";
import { ClientMDXComponent } from "./mdx-utils";
import { FootnoteProvider } from "./footnotes/FootnoteProvider";
import { FootnoteReference } from "./footnotes/FootnoteReference";
import { FootnoteSection } from "./footnotes/FootnoteSection";
import { parseFootnotes } from "./footnotes/parseFootnotes";

interface MDXWithFootnotesProps {
  source: string;
  components?: Record<string, React.ComponentType<any>>;
}

export function MDXWithFootnotes({ source, components = {} }: MDXWithFootnotesProps) {
  const { footnotes, contentWithoutFootnotes } = useMemo(() => {
    return parseFootnotes(source);
  }, [source]);

  // Transform content to replace footnote references with components
  const processedContent = useMemo(() => {
    let processed = contentWithoutFootnotes;

    // Replace footnote references with FootnoteReference components
    footnotes.forEach((footnote) => {
      const refPattern = new RegExp(`\\[${footnote.number}\\]`, "g");
      processed = processed.replace(
        refPattern,
        `<FootnoteReference id="${footnote.id.replace("fn-", "")}" number={${footnote.number}} />`,
      );
    });

    return processed;
  }, [contentWithoutFootnotes, footnotes]);

  // Enhanced components that include footnote handling
  const enhancedComponents = useMemo(() => {
    return {
      ...components,
      FootnoteReference: ({ id, number, ...props }: any) => (
        <FootnoteReference id={id} number={number} {...props} />
      ),
    };
  }, [components]);

  return (
    <FootnoteProvider content={source}>
      <div className="mdx-with-footnotes">
        <div className="mdx-content">
          <ClientMDXComponent source={processedContent} components={enhancedComponents} />
        </div>

        {footnotes.length > 0 && <FootnoteSection className="mt-12" />}
      </div>
    </FootnoteProvider>
  );
}
