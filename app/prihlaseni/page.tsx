import { redirect } from "next/navigation";
import { loginUserAction, registerUserAction } from "@/app/admin/actions";
import { getCurrentUser, getDefaultAdminCredentials } from "@/src/lib/auth";
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

function getErrorMessage(searchParams?: LoginPageProps["searchParams"]) {
  if (searchParams?.error === "login") {
    return "__LOGIN_ERROR__";
  }
  if (searchParams?.error === "register") {
    return searchParams.message ?? "__REGISTER_ERROR__";
  }
  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect(currentUser.role === "admin" ? searchParams?.next ?? "/ucet" : "/ucet");
  }

  const nextPath = searchParams?.next ?? "/ucet";
  const errorMessage = getErrorMessage(searchParams);
  const admin = getDefaultAdminCredentials();

  return (
    <LoginPageClient
      errorMessage={errorMessage}
      nextPath={nextPath}
      admin={admin}
      showLogout={searchParams?.logout === "1"}
      loginAction={loginUserAction}
      registerAction={registerUserAction}
    />
  );
}
