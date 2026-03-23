import Link from "next/link";
import { requireAuth, getDefaultAdminCredentials } from "@/src/lib/auth";
import { logoutUserAction } from "@/app/admin/actions";

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
    <div className="container-page py-12 pb-16">
      <div className="mx-auto max-w-4xl rounded-3xl bg-slate-950/70 p-8 shadow-soft ring-1 ring-white/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Můj účet</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">Vítejte, {user.username}</h1>
            <p className="mt-2 text-sm text-secondary">
              Přihlášení proběhlo úspěšně. Odtud můžete přejít do správy účtu nebo, pokud jste administrátor, i do správy inzerátů.
            </p>
          </div>
          <form action={logoutUserAction}>
            <button type="submit" className="btn-secondary">
              Odhlásit se
            </button>
          </form>
        </div>

        {searchParams?.registered === "1" ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Účet byl vytvořen a jste přihlášeni.
          </div>
        ) : null}

        {searchParams?.admin === "0" ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Tento účet nemá administrátorská oprávnění. Pro správu inzerátů použijte speciální účet {admin.username} / {admin.password}.
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold text-slate-100">Údaje účtu</h2>
            <dl className="mt-4 space-y-3 text-sm text-secondary">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Uživatelské jméno</dt>
                <dd className="font-medium">{user.username}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">E-mail</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Role</dt>
                <dd className="font-medium">{user.role === "admin" ? "Administrátor" : "Uživatel"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold text-slate-100">Další kroky</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/vozy" className="btn-secondary">
                Projít nabídku vozů
              </Link>
              {user.role === "admin" ? (
                <Link href="/admin" className="btn-primary">
                  Otevřít správu inzerátů
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
