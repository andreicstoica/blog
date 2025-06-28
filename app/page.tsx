import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section className="max-w-[40rem] mt-8">
      <h1 className="mb-8 text-2xl font-semibold text-pretty">My Blog</h1>
      <p className="mb-4 whitespace-pre-line text-pretty">
        {`Hi, my name is Andrei. \n \n I'm interested in how technology can help people directly, especially as it relates to expression and the physical world. Having worked in tech for the last ~7 years, and having pursued an individualized major titled "Human Computer Interaction and Ethical Innovation Systems", I have experience in product, physical and digital design, sustainability, and political economy. I am most interested in the intersections of these domains.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
