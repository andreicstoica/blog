export interface ParsedFootnote {
  id: string;
  number: number;
  content: string;
  refId: string;
}

export interface ParsedFootnoteReference {
  id: string;
  number: number;
  position: number;
}

export interface FootnoteParseResult {
  footnotes: ParsedFootnote[];
  references: ParsedFootnoteReference[];
  contentWithoutFootnotes: string;
}

/**
 * Parse footnotes from MDX content
 * Supports formats like:
 * - [1] footnote content
 * - [2] more footnote content
 * Also finds inline references like [1] in the text
 */
export function parseFootnotes(content: string): FootnoteParseResult {
  const footnotes: ParsedFootnote[] = [];
  const references: ParsedFootnoteReference[] = [];

  // Pattern to match footnote definitions at the end of content
  // Matches: [number] content until next footnote or end
  const footnoteDefPattern = /\[(\d+)\]\s*([^\[\n]*?)(?=\n\[|\n\n|$)/gm;

  // Pattern to match footnote references in text (excluding definitions)
  const footnoteRefPattern = /\[(\d+)\]/g;

  let contentWithoutFootnotes = content;
  let match;

  // Extract footnote definitions - look for them at the end of the content
  const lines = content.split("\n");
  let footnoteStartIndex = -1;

  // Find where footnotes start (usually after a blank line and before the first [number])
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.match(/^\[(\d+)\]/)) {
      footnoteStartIndex = i;
    } else if (line.length > 0 && footnoteStartIndex !== -1) {
      // We found content before footnotes, so footnotes start after this
      break;
    }
  }

  if (footnoteStartIndex !== -1) {
    // Extract footnote lines
    const footnoteLines = lines.slice(footnoteStartIndex);
    let currentFootnote: ParsedFootnote | null = null;

    footnoteLines.forEach((line) => {
      const footnoteMatch = line.match(/^\[(\d+)\]\s*(.*)$/);
      if (footnoteMatch) {
        // Save previous footnote if exists
        if (currentFootnote) {
          footnotes.push(currentFootnote);
        }

        // Start new footnote
        const number = parseInt(footnoteMatch[1], 10);
        currentFootnote = {
          id: `fn-${number}`,
          number,
          content: footnoteMatch[2].trim(),
          refId: `ref-${number}`,
        };
      } else if (currentFootnote && line.trim()) {
        // Continue previous footnote
        currentFootnote.content += " " + line.trim();
      }
    });

    // Add the last footnote
    if (currentFootnote) {
      footnotes.push(currentFootnote);
    }

    // Remove footnote section from content
    contentWithoutFootnotes = lines.slice(0, footnoteStartIndex).join("\n");
  }

  // Find all footnote references in the remaining content
  let refMatch;
  while ((refMatch = footnoteRefPattern.exec(contentWithoutFootnotes)) !== null) {
    const [, numberStr] = refMatch;
    const number = parseInt(numberStr, 10);

    // Only add reference if we have a corresponding footnote
    if (footnotes.some((fn) => fn.number === number)) {
      const reference: ParsedFootnoteReference = {
        id: `ref-${number}`,
        number,
        position: refMatch.index || 0,
      };

      references.push(reference);
    }
  }

  // Sort by number
  footnotes.sort((a, b) => a.number - b.number);
  references.sort((a, b) => a.number - b.number);

  // Clean up the content
  contentWithoutFootnotes = contentWithoutFootnotes
    .replace(/\n\s*\n\s*\n/g, "\n\n") // Remove excessive line breaks
    .trim();

  return {
    footnotes,
    references,
    contentWithoutFootnotes,
  };
}

/**
 * Transform content by replacing footnote references with footnote components
 */
export function transformFootnoteReferences(content: string, footnotes: ParsedFootnote[]): string {
  let transformedContent = content;

  // Replace footnote references with FootnoteReference components
  footnotes.forEach((footnote) => {
    const refPattern = new RegExp(`\\[${footnote.number}\\]`, "g");
    transformedContent = transformedContent.replace(
      refPattern,
      `<FootnoteReference id="${footnote.id}" number={${footnote.number}} />`,
    );
  });

  return transformedContent;
}

/**
 * Extract footnote content from the end of a text block
 * Useful for parsing footnotes that appear at the end of paragraphs
 */
export function extractFootnotesFromText(text: string): {
  cleanText: string;
  footnotes: ParsedFootnote[];
} {
  const lines = text.split("\n");
  const footnotes: ParsedFootnote[] = [];
  const cleanLines: string[] = [];

  let footnoteStartIndex = -1;

  // Find where footnotes start by looking for the first [number] pattern
  // that appears after some content
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\[(\d+)\]\s/)) {
      // Check if this looks like a footnote section (not just a reference)
      // Look for context - if previous lines are empty or this is near the end
      const prevNonEmptyIndex = i - 1;
      while (prevNonEmptyIndex >= 0 && lines[prevNonEmptyIndex].trim() === "") {
        // Skip empty lines
      }

      if (i > lines.length * 0.7) {
        // Footnotes usually appear in last 30% of content
        footnoteStartIndex = i;
        break;
      }
    }
  }

  if (footnoteStartIndex !== -1) {
    // Process content before footnotes
    cleanLines.push(...lines.slice(0, footnoteStartIndex));

    // Process footnotes
    const footnoteLines = lines.slice(footnoteStartIndex);
    let currentFootnote: ParsedFootnote | null = null;

    footnoteLines.forEach((line) => {
      const footnoteMatch = line.match(/^\[(\d+)\]\s*(.*)$/);
      if (footnoteMatch) {
        // Save previous footnote if exists
        if (currentFootnote) {
          footnotes.push(currentFootnote);
        }

        // Start new footnote
        const number = parseInt(footnoteMatch[1], 10);
        currentFootnote = {
          id: `fn-${number}`,
          number,
          content: footnoteMatch[2].trim(),
          refId: `ref-${number}`,
        };
      } else if (currentFootnote && line.trim()) {
        // Continue previous footnote
        currentFootnote.content += " " + line.trim();
      }
    });

    // Add the last footnote
    if (currentFootnote) {
      footnotes.push(currentFootnote);
    }
  } else {
    // No footnotes found, return original text
    cleanLines.push(...lines);
  }

  return {
    cleanText: cleanLines.join("\n").trim(),
    footnotes: footnotes.sort((a, b) => a.number - b.number),
  };
}
