import { readContent } from "@/src/lib/content-store";
import { HeaderClient } from "@/components/HeaderClient";

interface AlertContent {
  active?: boolean;
  text?: string;
  text_en?: string;
}

interface KontaktContent {
  phone: string;
  hours: { weekdays: string; saturday: string; sunday: string };
}

export async function Header() {
  const content = await readContent();
  const alert = content.alert as AlertContent | undefined;
  const kontaktCs = content.kontakt as KontaktContent | undefined;
  const kontaktEn = (content.kontakt_en ?? kontaktCs) as KontaktContent | undefined;

  return (
    <HeaderClient alert={alert} kontaktCs={kontaktCs} kontaktEn={kontaktEn} />
  );
}

