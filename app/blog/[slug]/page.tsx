import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/blog/utils";
import { baseUrl } from "app/sitemap";

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return {};
  }

  let { title, publishedAt: publishedTime, summary: description, image } = post.metadata;
  let ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Blog({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "My Blog",
            },
          }),
        }}
      />
      <div className="w-full">
        <header className="mb-12">
          <h1 className="title font-bold text-4xl md:text-5xl tracking-tight leading-tight mb-4 text-neutral-900 dark:text-neutral-100">
            {post.metadata.title}
          </h1>
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <time className="text-sm font-medium">{formatDate(post.metadata.publishedAt)}</time>
          </div>
          {post.metadata.summary && (
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed">
              {post.metadata.summary}
            </p>
          )}
        </header>

        <article className="prose prose-lg max-w-none text-neutral-900 dark:text-neutral-100">
          <CustomMDX source={post.content} />
        </article>
      </div>
    </section>
  );
}
