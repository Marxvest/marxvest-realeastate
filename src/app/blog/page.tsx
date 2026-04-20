import Link from "next/link";

import { blogPosts } from "@/lib/site-data";

export default function BlogPage() {
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <main className="pb-24">
      <section className="mx-auto grid w-[var(--page-width)] gap-12 py-16 lg:grid-cols-[1fr_0.36fr]">
        <div>
          <div className="section-cap">Blog</div>
          <h1 className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            Investor education shaped around land verification, payments, and smarter acquisition decisions.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--brand-text-muted)]">
            Use these articles to understand how disciplined land buying works,
            what to verify before payment, and how to think about long-term value
            in growth corridors.
          </p>

          <div className="mt-10 grid gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-7 shadow-[0_18px_50px_rgba(8,24,84,0.05)] transition hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(8,24,84,0.08)]"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--brand-text-soft)]">
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
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--brand-text-muted)]">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] transition hover:gap-3"
                >
                  Read more
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 shadow-[0_16px_40px_rgba(8,24,84,0.05)]">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Recent posts
            </div>
            <div className="mt-5 grid gap-4">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="border-t border-[var(--brand-border)] pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="font-semibold text-[var(--brand-text)]">{post.title}</div>
                  <div className="mt-2 text-sm text-[var(--brand-text-muted)]">
                    {post.readTime}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_16px_40px_rgba(8,24,84,0.05)]">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Categories
            </div>
            <div className="mt-5 grid gap-3 text-sm text-[var(--brand-text-muted)]">
              <div>Land verification</div>
              <div>Payments</div>
              <div>Buyer education</div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
