import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Search, ExternalLink, Star, Sparkles, Filter } from "lucide-react";

interface SearchParams {
  q?: string;
  category?: string;
  pricing?: string;
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const selectedCategory = resolvedParams.category || "All";
  const selectedPricing = resolvedParams.pricing || "All";

  // Query database with dynamic filters
  const tools = await prisma.tool.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { tagline: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        selectedCategory !== "All" ? { category: selectedCategory } : {},
        selectedPricing !== "All" ? { pricing: selectedPricing } : {},
      ],
    },
    orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
  });

  const categories = ["All", "Productivity", "Design", "Development", "Research", "Audio"];
  const pricingOptions = ["All", "Freemium", "Paid"];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-zinc-950 font-bold text-base shadow-sm">
              Ω
            </div>
            <span className="font-semibold text-lg tracking-tight">AI Orbit</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-400 ml-1">
              Directory
            </span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-md border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
          >
            Submit Tool
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
          <span>Curated intelligence ecosystem</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Discover vetted AI applications.
        </h1>
        <p className="text-base text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Explore production-grade AI systems, tools, and developer agents categorized for modern workflows.
        </p>

        {/* Search Input Bar */}
        <form method="GET" className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name, feature, or keyword..."
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-3 pl-11 pr-24 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-700 transition"
          />
          {selectedCategory !== "All" && (
            <input type="hidden" name="category" value={selectedCategory} />
          )}
          {selectedPricing !== "All" && (
            <input type="hidden" name="pricing" value={selectedPricing} />
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs rounded-lg transition"
          >
            Search
          </button>
        </form>
      </section>

      {/* Filter Chips Bar */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <Link
                  key={cat}
                  href={`/?category=${cat}${selectedPricing !== "All" ? `&pricing=${selectedPricing}` : ""}${q ? `&q=${q}` : ""}`}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                    active
                      ? "bg-zinc-100 text-zinc-950 border-zinc-100 font-medium"
                      : "border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Pricing Filters */}
          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1" />
            {pricingOptions.map((pr) => {
              const active = selectedPricing === pr;
              return (
                <Link
                  key={pr}
                  href={`/?pricing=${pr}${selectedCategory !== "All" ? `&category=${selectedCategory}` : ""}${q ? `&q=${q}` : ""}`}
                  className={`px-2.5 py-1 rounded-md transition ${
                    active
                      ? "bg-zinc-800 text-zinc-100 font-medium"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {pr}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {tools.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-400 text-sm">No tools matched your criteria.</p>
            <Link
              href="/"
              className="inline-block mt-3 text-xs text-zinc-200 underline underline-offset-4"
            >
              Reset filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="group relative flex flex-col justify-between p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 transition duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/tools/${tool.slug}`}>
                          <h3 className="font-medium text-base text-zinc-100 group-hover:text-white hover:underline cursor-pointer">
                          {tool.name}
                          </h3>
                        </Link>
                        {tool.isFeatured && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">{tool.category}</span>
                    </div>

                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                      title={`Visit ${tool.name}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                    {tool.tagline}
                  </p>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {tool.features.slice(0, 3).map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-zinc-950/60 border border-zinc-800/60 text-zinc-400"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                    <span className="font-medium text-zinc-300">{tool.rating.toFixed(1)}</span>
                    <span className="text-zinc-500">({tool.reviews})</span>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-zinc-800/60 text-zinc-300 font-medium text-[11px]">
                    {tool.pricing}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}