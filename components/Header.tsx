import Link from "next/link";
import { HeaderClient } from "@/components/HeaderClient";
import { getCurrentUser } from "@/src/lib/auth";

export async function Header() {
  const currentUser = await getCurrentUser();

  return (
    <HeaderClient currentUser={currentUser} />
  );
}

