import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, ExternalLink, Star, ShieldCheck, CheckCircle2 } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await prisma.tool.findUnique({ where: { slug } });

  if (!tool) {
    return { title: "Tool Not Found — AI Orbit" };
  }

  return {
    title: `${tool.name} — AI Orbit Directory`,
    description: tool.tagline,
  };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tool = await prisma.tool.findUnique({
    where: { slug },
  });

  if (!tool) return notFound();

  // Find related tools in the same category
  const relatedTools = await prisma.tool.findMany({
    where: {
      category: tool.category,
      id: { not: tool.id },
    },
    take: 3,
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 pb-20">
      {/* Header / Nav */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>

          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium rounded-lg transition"
          >
            Visit Website
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">{tool.name}</h1>
              {tool.isFeatured && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                  Featured
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-sm max-w-2xl">{tool.tagline}</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-500 block">Category</span>
              <span className="text-zinc-200 font-medium">{tool.category}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-500 block">Pricing</span>
              <span className="text-zinc-200 font-medium">{tool.pricing}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-500 block">Rating</span>
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" /> {tool.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Details & Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Overview
              </h2>
              <p className="text-zinc-300 leading-relaxed text-sm bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/80">
                {tool.description}
              </p>
            </section>

            <section>
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Core Capabilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tool.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-900/30 text-xs text-zinc-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
              <div className="flex items-center gap-2 text-zinc-200 text-xs font-semibold mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Vetted Application
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Audited for high availability, enterprise privacy standards, and active maintenance.
              </p>
            </div>

            {relatedTools.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Similar in {tool.category}
                </h3>
                <div className="space-y-2">
                  {relatedTools.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/tools/${rel.slug}`}
                      className="block p-3 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/60 transition"
                    >
                      <span className="text-xs font-medium text-zinc-200 block">{rel.name}</span>
                      <span className="text-[11px] text-zinc-500 line-clamp-1">{rel.tagline}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}