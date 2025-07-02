import { BlogPosts } from "app/components/posts";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

export default function Page() {
  return (
    <section className="w-full">
      <header className="mb-12">
        <h1 className="mb-6 text-4xl md:text-5xl font-bold tracking-tight text-pretty leading-tight text-neutral-900 dark:text-neutral-100">
          Blog
        </h1>
        <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
          Thoughts on technology, design, and building things.
        </p>
      </header>

      <div className="space-y-6">
        <BlogPosts />
      </div>
    </section>
  );
}
