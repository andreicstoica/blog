interface FootnoteData {
  id: string;
  content: string;
}

interface ProcessedContent {
  content: string;
  footnotes: FootnoteData[];
}

/**
 * Processes markdown content to handle footnotes
 * Converts [1], [2], etc. to proper footnote links
 * Extracts footnote definitions and creates proper footnote section
 */
export function processFootnotes(content: string): ProcessedContent {
  const footnotes: FootnoteData[] = [];
  let processedContent = content;

  // Pattern to match footnote definitions like "1 Text here" or "[1] Text here"
  const footnoteDefRegex = /^\[?(\d+)\]?\s+(.+)$/gm;

  // Pattern to match footnote references like [1], [2], etc.
  const footnoteRefRegex = /\[(\d+)\]/g;

  // Find all footnote definitions
  let match;
  const footnoteDefinitions: { [key: string]: string } = {};

  while ((match = footnoteDefRegex.exec(content)) !== null) {
    const [fullMatch, id, text] = match;

    // Check if this line looks like a footnote definition
    // (not just a random bracketed number in the middle of a paragraph)
    const lineStart = content.lastIndexOf('\n', match.index);
    const lineEnd = content.indexOf('\n', match.index);
    const line = content.substring(lineStart + 1, lineEnd === -1 ? undefined : lineEnd);

    // Only treat as footnote if it's at the start of a line
    if (line.trim().match(/^\[?\d+\]?\s+/)) {
      footnoteDefinitions[id] = text.trim();

      // Remove the footnote definition from the content
      processedContent = processedContent.replace(fullMatch, '');
    }
  }

  // Convert footnote references to proper links
  processedContent = processedContent.replace(footnoteRefRegex, (match, id) => {
    if (footnoteDefinitions[id]) {
      return `<sup><a href="#footnote-${id}" id="footnote-ref-${id}" className="footnote-ref">${id}</a></sup>`;
    }
    return match; // Keep original if no definition found
  });

  // Create footnote data array
  Object.entries(footnoteDefinitions).forEach(([id, content]) => {
    footnotes.push({
      id,
      content
    });
  });

  // Sort footnotes by ID
  footnotes.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  // Clean up any extra line breaks from removed footnote definitions
  processedContent = processedContent.replace(/\n{3,}/g, '\n\n');

  return {
    content: processedContent.trim(),
    footnotes
  };
}

/**
 * Alternative processing for content that uses footnote syntax at the end
 * This looks for a footnotes section and processes it
 */
export function processFootnotesFromSection(content: string): ProcessedContent {
  const footnotes: FootnoteData[] = [];
  let processedContent = content;

  // Look for footnotes section (usually at the end)
  const footnotesSectionRegex = /\n---\n([\s\S]*?)$/;
  const match = footnotesSectionRegex.exec(content);

  if (match) {
    const footnotesSection = match[1];
    processedContent = content.replace(footnotesSectionRegex, '');

    // Parse individual footnotes from the section
    const footnoteLines = footnotesSection.split('\n').filter(line => line.trim());

    footnoteLines.forEach(line => {
      const footnoteMatch = line.match(/^(\d+)\s+(.+)$/);
      if (footnoteMatch) {
        const [, id, text] = footnoteMatch;
        footnotes.push({
          id,
          content: text.trim()
        });
      }
    });
  }

  // Convert footnote references to proper links
  processedContent = processedContent.replace(/\[(\d+)\]/g, (match, id) => {
    const footnoteExists = footnotes.some(f => f.id === id);
    if (footnoteExists) {
      return `<sup><a href="#footnote-${id}" id="footnote-ref-${id}" className="footnote-ref">${id}</a></sup>`;
    }
    return match;
  });

  return {
    content: processedContent.trim(),
    footnotes
  };
}
