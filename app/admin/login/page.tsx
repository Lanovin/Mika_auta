export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  redirect("/prihlaseni?next=%2Fadmin");
}

export const metadata = {
  robots: { index: false, follow: false },
};
