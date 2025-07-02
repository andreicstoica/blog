import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div className="space-y-6">
      {allBlogs
        .sort((a, b) => {
          if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="group block p-4 rounded-lg transition-shadow duration-200 hover:shadow-[6px_6px_24px_rgba(0,0,0,0.15),-6px_-6px_24px_rgba(255,255,255,0.7)] dark:hover:shadow-[6px_6px_24px_rgba(0,0,0,0.4),-6px_-6px_24px_rgba(255,255,255,0.1)]"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex md:flex-row flex-col md:space-y-0 space-y-2">
              {/* Date Column */}
              <p className="text-neutral-500 dark:text-neutral-400 tabular-nums text-sm font-medium md:w-32 flex-shrink-0">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <div className="flex-1">
                {/* Title */}
                <h3 className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  {post.metadata.title}
                </h3>
                {/* Summary */}
                {post.metadata.summary && (
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1 line-clamp-2">
                    {post.metadata.summary}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
