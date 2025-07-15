# agents.md
> Rules and context for the AI agent embedded in **Zed** while working on my personal portfolio website.
> This file is automatically picked up by Zed (see <https://zed.dev/docs/ai/rules>) and is injected **at the top of every interaction** with the agent.

---

## 1 • Project Purpose & Scope
| Section | Details |
|:---|:---|
| Goal | Build a clean, fast, accessible personal site that introduces **Me**, showcases projects, and hosts a Markdown-driven blog. I am inspired by Bauhaus design principles. I don't want too much complexity, the simplest answer is usually the best. Same with animations and layout. Grids, responsive design that are mobile friendly. |
| Stack | Next.js 15 (App Router) on Vercel • Tailwind CSS v4 • TypeScript • MDX for blog • Blogs live in `/blog`, source in `/src`. |
| Live URL | https://andrei.bio |
| Audience | Recruiters, collaborators, friends—tech-savvy but time-constrained, and curious. |
| Success | Lighthouse ≥ 95 on all axes, CLS < 0.05 s, ≤ 125 KiB initial JS, visually appealing, mobile friendly |

---

## 2 • Directory Map (high-level)
| Path | Purpose |
|:---|:---|
| `/app` | Next.js App Router routes |
| `/app/components` | Reusable UI (server & client) |
| `/globals.css` | Tailwind configs, globals |
| `/app/blog` | Blog folder |
| `/app/blog/posts/*.mdx` | Blog posts|
| `/public` | Static assets |
| `/utils` | Utility functions and helpers (footnote support, not yet working) |

---

## 3 • Blog Authoring Conventions
1. Each post is a **pure `.md` or `.mdx` file** with YAML front-matter:
   ```yaml
   ---
   title: "Example Post Title"
   date: "2025-07-15"
   description: "One-sentence SEO summary."
   draft: false
   tags: [nextjs, tailwind]
   ---
