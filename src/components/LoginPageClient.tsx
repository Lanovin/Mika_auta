"use client";

import Link from "next/link";
import { useLanguage } from "@/src/lib/LanguageContext";
import { t } from "@/src/lib/translations";

interface LoginPageClientProps {
  errorMessage: string | null;
  nextPath: string;
  admin: { username: string; password: string };
  showLogout: boolean;
  loginAction: (formData: FormData) => void;
  registerAction: (formData: FormData) => void;
}

export function LoginPageClient({
  errorMessage,
  nextPath,
  admin,
  showLogout,
  loginAction,
  registerAction,
}: LoginPageClientProps) {
  const { lang } = useLanguage();

  const translatedError = errorMessage
    ? errorMessage === "__LOGIN_ERROR__"
      ? t("login.errorLogin", lang)
      : errorMessage === "__REGISTER_ERROR__"
        ? t("login.errorRegister", lang)
        : errorMessage
    : null;

  return (
    <div className="container-page py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
        <section className="card-panel p-8 text-white">
          <p className="section-kicker">{t("login.kicker", lang)}</p>
          <h1
            className="mt-3 text-3xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("login.heading", lang)}
          </h1>
          <p className="mt-4 text-sm text-secondary">
            {t("login.description", lang)}
          </p>

          <div className="card-panel mt-8 p-5">
            <h2 className="text-sm font-semibold">
              {t("login.adminAccess", lang)}
            </h2>
            <p className="mt-2 text-sm text-secondary">
              {t("login.adminDesc", lang)}
            </p>
            <div className="mt-3 space-y-1 text-sm text-white">
              <div>
                {t("login.username", lang)} {admin.username}
              </div>
              <div>
                {t("login.password", lang)} {admin.password}
              </div>
            </div>
          </div>

          {showLogout ? (
            <div
              className="mt-4 border-l-4 border-emerald-500/60 px-4 py-3 text-sm text-emerald-200"
              style={{ background: "var(--black-rich)" }}
            >
              {t("login.loggedOut", lang)}
            </div>
          ) : null}

          <div className="mt-8 text-sm text-secondary">
            {t("login.adminLinkDesc", lang)}{" "}
            <Link
              href="/admin"
              className="link-primary underline underline-offset-4"
            >
              {t("login.adminLink", lang)}
            </Link>
            .
          </div>
        </section>

        <section className="grid gap-6">
          {translatedError ? (
            <div
              className="border-l-4 border-red-500/60 px-4 py-3 text-sm text-red-300"
              style={{ background: "var(--black-rich)" }}
            >
              {translatedError}
            </div>
          ) : null}

          <div className="card-panel p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {t("login.loginHeading", lang)}
            </h2>
            <p className="mt-2 text-sm text-secondary">
              {t("login.loginDesc", lang)}
            </p>

            <form action={loginAction} className="mt-6 space-y-4">
              <input type="hidden" name="next" value={nextPath} />
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                  {t("login.identifier", lang)}
                </label>
                <input
                  name="identifier"
                  type="text"
                  required
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                  {t("login.passwordLabel", lang)}
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="mt-1 w-full"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                {t("login.submit", lang)}
              </button>
            </form>
          </div>

          <div className="card-panel p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {t("login.registerHeading", lang)}
            </h2>
            <p className="mt-2 text-sm text-secondary">
              {t("login.registerDesc", lang)}
            </p>

            <form action={registerAction} className="mt-6 grid gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                  {t("login.usernameLabel", lang)}
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                  {t("login.emailLabel", lang)}
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                  {t("login.passwordLabel", lang)}
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={4}
                  className="mt-1 w-full"
                />
              </div>
              <button type="submit" className="btn-secondary w-full">
                {t("login.registerSubmit", lang)}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
