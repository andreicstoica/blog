import React, { createContext, useContext, ReactNode } from "react";

interface Footnote {
  id: string;
  number: number;
  content: string;
  refId: string;
}

interface FootnoteContextType {
  footnotes: Footnote[];
  registerFootnote: (id: string, content: string) => number;
  getFootnoteByRef: (refId: string) => Footnote | undefined;
  getAllFootnotes: () => Footnote[];
}

const FootnoteContext = createContext<FootnoteContextType | undefined>(undefined);

export function useFootnotes() {
  const context = useContext(FootnoteContext);
  if (!context) {
    throw new Error("useFootnotes must be used within a FootnoteProvider");
  }
  return context;
}

interface FootnoteProviderProps {
  children: ReactNode;
  content?: string;
}

export function FootnoteProvider({ children, content }: FootnoteProviderProps) {
  const parseFootnotesFromContent = (text: string): Footnote[] => {
    // Pattern to match footnotes at the end of paragraphs
    // Matches patterns like: [1] footnote content, [2] more content, etc.
    const footnotePattern = /\[(\d+)\]\s*([^\[\n]*?)(?=\[|\n\n|$)/g;
    const parsedFootnotes: Footnote[] = [];
    let match;

    while ((match = footnotePattern.exec(text)) !== null) {
      const [, refNumber, content] = match;
      const footnote: Footnote = {
        id: `fn-${refNumber}`,
        number: parseInt(refNumber, 10),
        content: content.trim(),
        refId: `ref-${refNumber}`,
      };
      parsedFootnotes.push(footnote);
    }

    // Sort footnotes by number
    return parsedFootnotes.sort((a, b) => a.number - b.number);
  };

  const footnotes = content ? parseFootnotesFromContent(content) : [];
  const footnoteCounter = footnotes.length;

  const registerFootnote = (id: string, content: string): number => {
    const existingFootnote = footnotes.find((fn) => fn.id === id);
    if (existingFootnote) {
      return existingFootnote.number;
    }

    const newNumber = footnoteCounter + 1;
    const newFootnote: Footnote = {
      id,
      number: newNumber,
      content,
      refId: `ref-${id}`,
    };

    footnotes.push(newFootnote);
    return newNumber;
  };

  const getFootnoteByRef = (refId: string): Footnote | undefined => {
    return footnotes.find((fn) => fn.refId === refId);
  };

  const getAllFootnotes = (): Footnote[] => {
    return footnotes.sort((a, b) => a.number - b.number);
  };

  const contextValue: FootnoteContextType = {
    footnotes,
    registerFootnote,
    getFootnoteByRef,
    getAllFootnotes,
  };

  return <FootnoteContext.Provider value={contextValue}>{children}</FootnoteContext.Provider>;
}
