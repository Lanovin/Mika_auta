import { requireAuth, getDefaultAdminCredentials } from "@/src/lib/auth";
import { logoutUserAction } from "@/app/admin/actions";
import { AccountPageClient } from "@/src/components/AccountPageClient";

interface AccountPageProps {
  searchParams?: {
    registered?: string;
    admin?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const user = await requireAuth();
  const admin = getDefaultAdminCredentials();

  return (
    <AccountPageClient
      user={{ username: user.username, email: user.email, role: user.role }}
      admin={{ username: admin.username, password: admin.password }}
      showRegistered={searchParams?.registered === "1"}
      showNoAdmin={searchParams?.admin === "0"}
      logoutAction={logoutUserAction}
    />
  );
}
