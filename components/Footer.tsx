import Link from "next/link";
import { readContent } from "@/src/lib/content-store";
import { FooterClient } from "@/components/FooterClient";

interface FooterContent {
  description: string;
  copyright: string;
  tagline: string;
  partners: string[];
}

interface KontaktContent {
  phone: string;
  email: string;
  address: { street: string; city: string; note1: string };
  hours: { weekdays: string; saturday: string; sunday: string };
}

export async function Footer() {
  const content = await readContent();
  const f = content.footer as FooterContent;
  const fEn = (content.footer_en ?? f) as FooterContent;
  const k = content.kontakt as KontaktContent;
  const kEn = (content.kontakt_en ?? k) as KontaktContent;

  return <FooterClient f={f} fEn={fEn} k={k} kEn={kEn} />;
}

