"use client";

import Link from "next/link";
import { useLanguage } from "@/src/lib/LanguageContext";
import { t } from "@/src/lib/translations";

interface AccountUser {
  username: string;
  email: string;
  role: string;
}

interface AccountPageClientProps {
  user: AccountUser;
  admin: { username: string; password: string };
  showRegistered: boolean;
  showNoAdmin: boolean;
  logoutAction: () => void;
}

export function AccountPageClient({
  user,
  admin,
  showRegistered,
  showNoAdmin,
  logoutAction,
}: AccountPageClientProps) {
  const { lang } = useLanguage();

  return (
    <div className="container-page py-12 pb-16">
      <div className="card-panel mx-auto max-w-4xl p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker">{t("account.kicker", lang)}</p>
            <h1
              className="mt-2 text-3xl font-semibold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("account.welcome", lang)} {user.username}
            </h1>
            <p className="mt-2 text-sm text-secondary">
              {t("account.successDesc", lang)}
            </p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="btn-secondary">
              {t("account.logout", lang)}
            </button>
          </form>
        </div>

        {showRegistered ? (
          <div
            className="mt-6 border-l-4 border-emerald-500/60 px-4 py-3 text-sm text-emerald-200"
            style={{ background: "var(--black-rich)" }}
          >
            {t("account.registered", lang)}
          </div>
        ) : null}

        {showNoAdmin ? (
          <div
            className="mt-6 border-l-4 border-amber-500/60 px-4 py-3 text-sm text-amber-200"
            style={{ background: "var(--black-rich)" }}
          >
            {t("account.noAdmin", lang)} {admin.username} / {admin.password}.
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="card-panel p-6">
            <h2 className="text-lg font-semibold text-white">
              {t("account.info", lang)}
            </h2>
            <dl className="mt-4 space-y-3 text-sm text-secondary">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">
                  {t("account.usernameLabel", lang)}
                </dt>
                <dd className="font-medium">{user.username}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">
                  {t("account.emailLabel", lang)}
                </dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">
                  {t("account.roleLabel", lang)}
                </dt>
                <dd className="font-medium">
                  {user.role === "admin"
                    ? t("account.roleAdmin", lang)
                    : t("account.roleUser", lang)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card-panel p-6">
            <h2 className="text-lg font-semibold text-white">
              {t("account.nextSteps", lang)}
            </h2>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/vozy" className="btn-secondary">
                {t("account.browseCars", lang)}
              </Link>
              {user.role === "admin" ? (
                <Link href="/admin" className="btn-primary">
                  {t("account.openAdmin", lang)}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
