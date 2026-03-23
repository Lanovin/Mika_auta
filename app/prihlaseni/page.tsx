import Link from "next/link";
import { redirect } from "next/navigation";
import { loginUserAction, registerUserAction } from "@/app/admin/actions";
import { getCurrentUser, getDefaultAdminCredentials } from "@/src/lib/auth";

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
    return "Přihlášení se nepodařilo. Zkontrolujte e-mail, uživatelské jméno a heslo.";
  }
  if (searchParams?.error === "register") {
    return searchParams.message ?? "Registrace se nepodařila.";
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
    <div className="container-page py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
        <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-soft">
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em]">Účet a přihlášení</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Přihlášení do webu autobazaru</h1>
          <p className="mt-4 text-sm text-slate-200">
            Návštěvníci si mohou vytvořit běžný účet přes e-mail a uživatelské jméno. Speciální účet admin odemkne správu inzerátů a kompletní administraci vozů.
          </p>

          <div className="mt-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
            <h2 className="text-sm font-semibold">Admin přístup</h2>
            <p className="mt-2 text-sm text-slate-200">
              Pro správu vozů se přihlaste speciálním účtem:
            </p>
            <div className="mt-3 space-y-1 text-sm text-white">
              <div>Uživatelské jméno: {admin.username}</div>
              <div>Heslo: {admin.password}</div>
            </div>
          </div>

          {searchParams?.logout === "1" ? (
            <div className="mt-4 rounded-2xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              Byli jste úspěšně odhlášeni.
            </div>
          ) : null}

          <div className="mt-8 text-sm text-secondary">
            Po přihlášení administrátora se zpřístupní i stránka <Link href="/admin" className="link-primary underline underline-offset-4">správy vozů</Link>.
          </div>
        </section>

        <section className="grid gap-6">
          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Přihlášení</h2>
            <p className="mt-2 text-sm text-slate-600">
              Přihlásit se lze e-mailem nebo uživatelským jménem.
            </p>

            <form action={loginUserAction} className="mt-6 space-y-4">
              <input type="hidden" name="next" value={nextPath} />
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">E-mail nebo uživatelské jméno</label>
                <input name="identifier" type="text" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Heslo</label>
                <input name="password" type="password" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" />
              </div>
              <button type="submit" className="btn-primary w-full">
                Přihlásit se
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Vytvořit účet</h2>
            <p className="mt-2 text-sm text-slate-600">
              Nový uživatel si vytvoří účet přes uživatelské jméno, e-mail a heslo.
            </p>

            <form action={registerUserAction} className="mt-6 grid gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Uživatelské jméno</label>
                <input name="username" type="text" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">E-mail</label>
                <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Heslo</label>
                <input name="password" type="password" required minLength={4} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" />
              </div>
              <button type="submit" className="btn-secondary w-full">
                Vytvořit účet
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
