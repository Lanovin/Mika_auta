import type { Metadata } from "next";
import { HomePageClient } from "@/src/components/HomePageClient";
import { readPublishedVehicles } from "@/src/lib/vehicle-store";
import { readContent } from "@/src/lib/content-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Mika Auto – Autobazar | Kvalitní ojeté vozy Brno",
  description: "Autobazar Mika Auto – široká nabídka prověřených ojetých vozů. Výkup aut, financování, pojištění. Brno, od roku 2007.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [vehicles, content] = await Promise.all([readPublishedVehicles(), readContent()]);
  const homepageSettings = content.homepage_settings as { mode?: string; banners?: { imageUrl: string; linkUrl?: string; alt?: string }[] } | undefined;

  return <HomePageClient vehicles={vehicles} homepageMode={homepageSettings?.mode || "default"} banners={homepageSettings?.banners || []} />;
}

