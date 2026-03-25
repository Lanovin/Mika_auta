import Link from "next/link";
import { requireAdminAuth, getDefaultAdminCredentials } from "@/src/lib/auth";
import { readVehicles } from "@/src/lib/vehicle-store";
import { deleteVehicleAction, logoutUserAction } from "@/app/admin/actions";

interface AdminDashboardProps {
  searchParams?: {
    created?: string;
    updated?: string;
    deleted?: string;
  };
}

export const dynamic = "force-dynamic";

function getNotice(searchParams?: AdminDashboardProps["searchParams"]) {
  if (searchParams?.created === "1") {
    return "Vůz byl úspěšně přidán do nabídky.";
  }
  if (searchParams?.updated === "1") {
    return "Změny vozu byly uloženy.";
  }
  if (searchParams?.deleted === "1") {
    return "Vůz byl odstraněn z nabídky.";
  }
  return null;
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  await requireAdminAuth();
  const vehicles = await readVehicles();
  const notice = getNotice(searchParams);
  const credentials = getDefaultAdminCredentials();

  return (
    <div className="container-page py-10 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Interní administrace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>Správa nabídky vozů</h1>
          <p className="mt-2 max-w-2xl text-sm text-secondary">
            Odtud klient pohodlně přidá nový vůz, upraví cenu, skryje neaktuální inzerát nebo vymění fotky. Veřejné stránky se po uložení automaticky aktualizují.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/obsah" className="btn-secondary">
            Správa obsahu
          </Link>
          <Link href="/admin/novy" className="btn-primary">
            Přidat nový vůz
          </Link>
          <form action={logoutUserAction}>
            <button type="submit" className="btn-secondary">
              Odhlásit se
            </button>
          </form>
        </div>
      </div>

      {credentials.usesDefaults ? (
        <div className="mt-6 border-l-4 border-amber-500/60 px-4 py-3 text-sm text-amber-200" style={{ background: "var(--black-rich)" }}>
          Administrace používá speciální účet admin / admin. Před nasazením doporučujeme toto heslo změnit.
        </div>
      ) : null}

      {notice ? (
        <div className="mt-6 border-l-4 border-emerald-500/60 px-4 py-3 text-sm text-emerald-200" style={{ background: "var(--black-rich)" }}>
          {notice}
        </div>
      ) : null}

      <section className="card-panel mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y text-sm" style={{ borderColor: "var(--black-border)" }}>
            <thead style={{ background: "var(--black-rich)" }} className="text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Vůz</th>
                <th className="px-4 py-3 font-medium">Cena</th>
                <th className="px-4 py-3 font-medium">Rok / km</th>
                <th className="px-4 py-3 font-medium">Stav</th>
                <th className="px-4 py-3 font-medium">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--black-border)" }}>
              {vehicles.map((vehicle) => {
                const deleteAction = deleteVehicleAction.bind(null, vehicle.id);

                return (
                  <tr key={vehicle.id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white">{vehicle.title}</div>
                      <div className="mt-1 text-xs text-muted">{vehicle.make} · {vehicle.model} · {vehicle.location}</div>
                    </td>
                    <td className="px-4 py-4 font-medium text-white">{vehicle.price.toLocaleString("cs-CZ")} Kč</td>
                    <td className="px-4 py-4 text-secondary">{vehicle.year} · {vehicle.mileage.toLocaleString("cs-CZ")} km</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span
                          className="px-3 py-1 font-medium"
                          style={{
                            background: vehicle.published ? "rgba(16,185,129,0.12)" : "var(--black-rich)",
                            color: vehicle.published ? "#6ee7b7" : "var(--cream-muted)",
                            border: vehicle.published ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--black-border)",
                          }}
                        >
                          {vehicle.published ? "Veřejný" : "Skrytý"}
                        </span>
                        {vehicle.featured ? (
                          <span className="px-3 py-1 font-medium" style={{ background: "rgba(201,168,76,0.10)", color: "var(--gold)", border: "1px solid var(--gold-dim)" }}>
                            Doporučený
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/vozy/${vehicle.id}`} className="btn-secondary px-3 py-1.5 text-xs">
                          Náhled
                        </Link>
                        <Link href={`/admin/upravit/${vehicle.id}`} className="btn-secondary px-3 py-1.5 text-xs">
                          Upravit
                        </Link>
                        <form action={deleteAction}>
                          <button
                            type="submit"
                            className="px-3 py-1.5 text-xs font-semibold transition hover:opacity-80"
                            style={{ background: "var(--black-rich)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.4)" }}
                          >
                            Smazat
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
