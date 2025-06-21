import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-3"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex md:flex-row flex-col md:space-y-0">
              {/* Date Column */}
              <p className="text-neutral-600 dark:text-neutral-400 tabular-nums md:w-32 flex-shrink-0">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              {/* Title Column */}
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
