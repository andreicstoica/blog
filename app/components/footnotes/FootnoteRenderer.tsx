"use client";

import React, { useMemo } from "react";
import { FootnoteProvider } from "./FootnoteProvider";
import { FootnoteReference } from "./FootnoteReference";
import { FootnoteSection } from "./FootnoteSection";
import { parseFootnotes, transformFootnoteReferences } from "./parseFootnotes";

interface FootnoteRendererProps {
  content: string;
  children: React.ReactNode;
}

export function FootnoteRenderer({ content, children }: FootnoteRendererProps) {
  const { footnotes, contentWithoutFootnotes } = useMemo(() => {
    return parseFootnotes(content);
  }, [content]);

  // Create a map of footnote numbers to their data for quick lookup
  const footnoteMap = useMemo(() => {
    const map = new Map();
    footnotes.forEach((footnote) => {
      map.set(footnote.number, footnote);
    });
    return map;
  }, [footnotes]);

  // Transform the content to replace footnote references
  const transformedContent = useMemo(() => {
    return transformFootnoteReferences(contentWithoutFootnotes, footnotes);
  }, [contentWithoutFootnotes, footnotes]);

  // Custom components for MDX that include footnote handling
  const footnoteComponents = useMemo(() => {
    return {
      FootnoteReference: ({ id, number, ...props }: any) => (
        <FootnoteReference id={id} number={number} {...props} />
      ),
    };
  }, []);

  return (
    <FootnoteProvider content={content}>
      <div className="footnote-content-wrapper">
        {/* Render the main content */}
        <div className="prose-content">
          {children}
        </div>

        {/* Render footnotes section if we have footnotes */}
        {footnotes.length > 0 && (
          <FootnoteSection className="mt-12" />
        )}
      </div>
    </FootnoteProvider>
  );
}

// Helper component to inject footnote references into content
export function withFootnotes(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    const { content, ...otherProps } = props;

    return (
      <FootnoteRenderer content={content}>
        <Component {...otherProps} />
      </FootnoteRenderer>
    );
  };
}

// Hook to get footnote data within the renderer
export function useFootnoteData(content: string) {
  return useMemo(() => {
    return parseFootnotes(content);
  }, [content]);
}
