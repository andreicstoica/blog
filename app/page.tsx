import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section className="w-full">
      <header className="mb-12">
        <h1 className="mb-6 text-4xl md:text-5xl font-bold tracking-tight text-pretty leading-tight text-neutral-900 dark:text-neutral-100">
          My Blog
        </h1>
        <div className="max-w-none">
          <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            Hi, my name is Andrei.
          </p>
          <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            I'm interested in how technology can help people directly, especially as it relates to
            expression and the physical world. Having worked in tech for the last ~7 years, and
            having pursued an individualized major titled "Human Computer Interaction and Ethical
            Innovation Systems", I have experience in product, physical and digital design,
            sustainability, and political economy. I am most interested in the intersections of
            these domains.
          </p>
        </div>
      </header>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
          Recent Posts
        </h2>
        <BlogPosts />
      </div>
    </section>
  );
}
