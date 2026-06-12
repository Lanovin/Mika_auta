import type { Metadata } from "next";
import { readContent } from "@/src/lib/content-store";
import { notFound } from "next/navigation";
import { ServiceDetailClient } from "@/src/components/ServiceDetailClient";

export const revalidate = 300;

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ServiceItem {
  icon?: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  csTitle?: string;
}

interface SluzbyContent {
  services: ServiceItem[];
}

// Service titles are editable in the CMS, so links generated from an older
// content version (stale menu, search engines, hardcoded links) may use a
// different slug than the current title. Fall back to a prefix match so e.g.
// "vykup-vozu-za-hotove" still opens the service now slugged "vykup-vozu".
function findServiceIndex(services: ServiceItem[], slug: string): number {
  const exact = services.findIndex((s) => slugify(s.title) === slug);
  if (exact !== -1) return exact;

  return services.findIndex((s) => {
    const candidate = slugify(s.title);
    return candidate.length > 0 && (candidate.startsWith(slug) || slug.startsWith(candidate));
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const content = await readContent();
  const cs = content.sluzby as SluzbyContent;
  const service = cs.services[findServiceIndex(cs.services, slug)];
  if (!service) return {};
  return {
    title: `${service.title} – Služby`,
    description: service.shortDesc,
    alternates: { canonical: `/sluzby/${slug}` },
    openGraph: {
      title: `${service.title} | Mika Auto`,
      description: service.shortDesc,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const content = await readContent();
  const cs = content.sluzby as SluzbyContent;
  const en = (content.sluzby_en ?? cs) as SluzbyContent;

  const serviceIndex = findServiceIndex(cs.services, slug);
  if (serviceIndex === -1) return notFound();
  const service = cs.services[serviceIndex];
  const serviceEn = en.services[serviceIndex] ?? service;

  const others = cs.services
    .map((s, i) => ({ ...s, idx: i }))
    .filter((s) => s.idx !== serviceIndex);
  // Include csTitle so the client can always generate the correct (Czech-based) slug
  const othersEn = en.services
    .map((s, i) => ({ ...s, idx: i, csTitle: cs.services[i]?.title ?? s.title }))
    .filter((s) => s.idx !== serviceIndex);

  // Pass the canonical slug so slug-based logic in the client matches even
  // when the visitor arrived through an older slug variant.
  const canonicalSlug = slugify(cs.services[serviceIndex]?.title ?? "") || slug;

  return <ServiceDetailClient service={service} serviceEn={serviceEn} others={others} othersEn={othersEn} slug={canonicalSlug} serviceIndex={serviceIndex} />;
}
