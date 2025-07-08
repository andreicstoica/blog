import React from "react";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MDXComponentProps {
  source: string;
  components?: Record<string, React.ComponentType<any>>;
}

export async function compileMDX(source: string) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  });

  const { default: MDXContent } = await run(compiled, {
    ...runtime,
  });

  return MDXContent;
}

// For server-side rendering
export async function ServerMDXComponent({ source, components = {} }: MDXComponentProps) {
  const MDXContent = await compileMDX(source);

  return <MDXContent components={components} />;
}

// For client-side rendering
export function ClientMDXComponent({ source, components = {} }: MDXComponentProps) {
  const [MDXContent, setMDXContent] = React.useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const compileMDXContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const CompiledMDX = await compileMDX(source);
        setMDXContent(() => CompiledMDX);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to compile MDX");
      } finally {
        setIsLoading(false);
      }
    };

    compileMDXContent();
  }, [source]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!MDXContent) {
    return <div>No content</div>;
  }

  return <MDXContent components={components} />;
}
