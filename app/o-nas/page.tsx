import { readContent } from "@/src/lib/content-store";
import { AboutPageClient } from "@/src/components/AboutPageClient";

export const dynamic = "force-dynamic";

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
