import { readContent } from "@/src/lib/content-store";
import { notFound } from "next/navigation";
import { ServiceDetailClient } from "@/src/components/ServiceDetailClient";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ServiceItem {
  icon: string;
  title: string;
  shortDesc: string;
  longDesc: string;
}

interface SluzbyContent {
  services: ServiceItem[];
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await readContent();
  const cs = content.sluzby as SluzbyContent;
  const en = (content.sluzby_en ?? cs) as SluzbyContent;

  const serviceIndex = cs.services.findIndex((s) => slugify(s.title) === slug);
  if (serviceIndex === -1) return notFound();
  const service = cs.services[serviceIndex];
  const serviceEn = en.services[serviceIndex] ?? service;

  const others = cs.services
    .map((s, i) => ({ ...s, idx: i }))
    .filter((s) => slugify(s.title) !== slug);
  const othersEn = en.services
    .map((s, i) => ({ ...s, idx: i }))
    .filter((_, i) => slugify(cs.services[i]?.title ?? "") !== slug);

  return <ServiceDetailClient service={service} serviceEn={serviceEn} others={others} othersEn={othersEn} slug={slug} serviceIndex={serviceIndex} />;
}
