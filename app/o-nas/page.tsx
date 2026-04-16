import type { Metadata } from "next";
import { readContent } from "@/src/lib/content-store";
import { AboutPageClient } from "@/src/components/AboutPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "O nás – MIKAAUTO s.r.o.",
  description: "Autobazar Mika Auto – od roku 2007 se zabýváme výkupem a prodejem kvalitních ojetých vozů. 100% garance původu, individuální přístup.",
  alternates: { canonical: "/o-nas" },
  openGraph: {
    title: "O nás | Mika Auto",
    description: "Poznejte příběh autobazaru Mika Auto – od roku 2007 na trhu s ojetými vozy.",
  },
};

export default async function AboutPage() {
  const content = await readContent();
  const cs = content.onas as {
    header: { kicker: string; title: string; description: string };
    history: { title: string; text1: string; text2: string; milestones: string[] };
    stats: { value: string; label: string }[];
    approach: { kicker: string; title: string; description: string }[];
  };
  const en = (content.onas_en ?? cs) as typeof cs;

  return <AboutPageClient cs={cs} en={en} />;
}
