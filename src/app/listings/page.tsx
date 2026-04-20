import { ListingCard } from "@/components/listing-card";
import { listings } from "@/lib/site-data";

type ListingsPageProps = {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
};

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const selectedStatus = params.status;
  const query = params.q?.trim().toLowerCase() ?? "";
  const visibleListings = listings.filter((listing) => {
    const statusMatch = selectedStatus ? listing.status === selectedStatus : true;
    const queryMatch = query
      ? [
          listing.title,
          listing.estateName,
          listing.location,
          listing.state,
          ...listing.plotSizes,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;

    return statusMatch && queryMatch;
  });

  const filters = [
    { label: "All", href: query ? `/listings?q=${encodeURIComponent(query)}` : "/listings", active: !selectedStatus },
    {
      label: "Available",
      href: `/listings?status=available${query ? `&q=${encodeURIComponent(query)}` : ""}`,
      active: selectedStatus === "available",
    },
    {
      label: "Selling fast",
      href: `/listings?status=selling-fast${query ? `&q=${encodeURIComponent(query)}` : ""}`,
      active: selectedStatus === "selling-fast",
    },
    {
      label: "Allocation after full payment",
      href: `/listings?status=allocation-after-full-payment${query ? `&q=${encodeURIComponent(query)}` : ""}`,
      active: selectedStatus === "allocation-after-full-payment",
    },
  ];

  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-14">
        <div className="max-w-4xl space-y-6">
          <div className="section-cap">Listings</div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold leading-tight text-[var(--brand-text)] sm:text-6xl">
            Land and estate inventory framed for faster due diligence.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--brand-text-muted)]">
            Each listing surfaces location, plot sizing, documentation cues, and
            acquisition posture before you engage the sales flow.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <a
              key={filter.label}
              href={filter.href}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                filter.active
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                  : "border-[var(--brand-border-strong)] text-[var(--brand-text-muted)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
              }`}
            >
              {filter.label}
            </a>
          ))}
        </div>

        <form className="mt-6 max-w-2xl rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-3 sm:flex sm:items-center sm:gap-3">
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search by estate, location, or plot size"
            className="w-full border-0 bg-transparent px-3 py-3 text-base text-[var(--brand-text)] outline-none"
          />
          {selectedStatus ? <input type="hidden" name="status" value={selectedStatus} /> : null}
          <button
            type="submit"
            className="mt-3 inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white sm:mt-0"
          >
            Search listings
          </button>
        </form>

        <p className="mt-4 text-sm text-[var(--brand-text-muted)]">
          Showing {visibleListings.length} {visibleListings.length === 1 ? "listing" : "listings"}
          {query ? ` for "${params.q}"` : ""}.
        </p>

        <div className="mt-10">
          {visibleListings.length ? (
            visibleListings.map((listing) => (
              <ListingCard key={listing.slug} listing={listing} />
            ))
          ) : (
            <div className="rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--brand-text)]">
                No matching listing found.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--brand-text-muted)]">
                Try a broader location, estate name, or plot size search, or reset the
                active status filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
