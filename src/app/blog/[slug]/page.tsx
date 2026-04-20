import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts } from "@/lib/site-data";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-16">
        <div className="max-w-3xl">
          <div className="section-cap">Blog</div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[var(--brand-text-soft)]">
            <span>{new Date(post.publishedAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}</span>
            <span>•</span>
            <span>{post.readTime}</span>
            <span>•</span>
            <span>{post.category}</span>
          </div>
        </div>

        <article className="mt-10 max-w-3xl space-y-6 text-lg leading-8 text-[var(--brand-text-muted)]">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] transition hover:gap-3"
          >
            Back to blog
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
