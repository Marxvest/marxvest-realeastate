import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { listings } from "@/lib/site-data";
import { blogPosts } from "@/lib/site-data";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

function getRelatedListings() {
  return listings.slice(0, 2);
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return buildMetadata({
      title: "Article not found",
      description: "The requested Marxvest article could not be found.",
      path: "/blog",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.publishedAt,
    keywords: [post.title, post.category, "land buying tips Nigeria", "real estate guides Nigeria"],
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);
  const relatedListings = getRelatedListings();
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <main className="pb-24">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={buildArticleSchema(post)} />
      <section className="mx-auto w-[var(--page-width)] py-16">
        <div className="max-w-3xl">
          <Breadcrumbs items={breadcrumbs} />
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
            <span>•</span>
            <span>By Marxvest Real Estate</span>
          </div>
          <p className="mt-6 text-lg leading-8 text-[var(--brand-text-muted)]">
            {post.excerpt}
          </p>
        </div>

        <article className="mt-10 max-w-3xl space-y-6 text-lg leading-8 text-[var(--brand-text-muted)]">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <section className="mt-12 max-w-5xl rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
            Helpful next steps for buyers
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link href="/listings" className="rounded-[1.4rem] border border-[var(--brand-border)] bg-white px-5 py-5 text-base text-[var(--brand-text-muted)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]">
              View available land listings in Nigeria
            </Link>
            <Link href="/trust" className="rounded-[1.4rem] border border-[var(--brand-border)] bg-white px-5 py-5 text-base text-[var(--brand-text-muted)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]">
              Read our guide to trust, documentation, and buyer protection
            </Link>
            <Link href="/contact" className="rounded-[1.4rem] border border-[var(--brand-border)] bg-white px-5 py-5 text-base text-[var(--brand-text-muted)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]">
              Contact Marxvest Real Estate for land guidance
            </Link>
          </div>
        </section>

        <section className="mt-10 max-w-5xl grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
              Related articles
            </h2>
            <div className="mt-5 grid gap-4">
              {relatedPosts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="rounded-[1.4rem] border border-[var(--brand-border)] px-5 py-4 transition hover:border-[var(--brand-primary)]"
                >
                  <div className="text-lg font-semibold text-[var(--brand-text)]">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--brand-text-muted)]">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
              Estates to review next
            </h2>
            <div className="mt-5 grid gap-4">
              {relatedListings.map((listing) => (
                <Link
                  key={listing.slug}
                  href={`/listings/${listing.slug}`}
                  className="rounded-[1.4rem] border border-[var(--brand-border)] px-5 py-4 transition hover:border-[var(--brand-primary)]"
                >
                  <div className="text-lg font-semibold text-[var(--brand-text)]">
                    {listing.estateName}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--brand-text-muted)]">
                    {listing.location}, {listing.state} · {listing.priceLabel}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

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
