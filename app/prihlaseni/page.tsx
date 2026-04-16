import { redirect } from "next/navigation";
import { loginUserAction } from "@/app/admin/actions";
import { getCurrentUser } from "@/src/lib/auth";
import { LoginPageClient } from "@/src/components/LoginPageClient";

interface LoginPageProps {
  searchParams?: {
    error?: string;
    message?: string;
    next?: string;
    logout?: string;
  };
}

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

function getErrorMessage(searchParams?: LoginPageProps["searchParams"]) {
  if (searchParams?.error === "login") {
    return "__LOGIN_ERROR__";
  }
  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.role === "admin") {
    redirect(searchParams?.next ?? "/admin");
  }
  if (currentUser) {
    redirect("/");
  }

  const nextPath = searchParams?.next ?? "/admin";
  const errorMessage = getErrorMessage(searchParams);

  return (
    <LoginPageClient
      errorMessage={errorMessage}
      nextPath={nextPath}
      showLogout={searchParams?.logout === "1"}
      loginAction={loginUserAction}
    />
  );
}
