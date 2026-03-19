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
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Interní administrace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Správa nabídky vozů</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Odtud klient pohodlně přidá nový vůz, upraví cenu, skryje neaktuální inzerát nebo vymění fotky. Veřejné stránky se po uložení automaticky aktualizují.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/novy" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark">
            Přidat nový vůz
          </Link>
          <form action={logoutUserAction}>
            <button type="submit" className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              Odhlásit se
            </button>
          </form>
        </div>
      </div>

      {credentials.usesDefaults ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Administrace používá speciální účet admin / admin. Před nasazením doporučujeme toto heslo změnit.
        </div>
      ) : null}

      {notice ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      ) : null}

      <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Vůz</th>
                <th className="px-4 py-3 font-medium">Cena</th>
                <th className="px-4 py-3 font-medium">Rok / km</th>
                <th className="px-4 py-3 font-medium">Stav</th>
                <th className="px-4 py-3 font-medium">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((vehicle) => {
                const deleteAction = deleteVehicleAction.bind(null, vehicle.id);

                return (
                  <tr key={vehicle.id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{vehicle.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{vehicle.make} · {vehicle.model} · {vehicle.location}</div>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-900">{vehicle.price.toLocaleString("cs-CZ")} Kč</td>
                    <td className="px-4 py-4 text-slate-600">{vehicle.year} · {vehicle.mileage.toLocaleString("cs-CZ")} km</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={`rounded-full px-3 py-1 ${vehicle.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {vehicle.published ? "Veřejný" : "Skrytý"}
                        </span>
                        {vehicle.featured ? (
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">Doporučený</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/vozy/${vehicle.id}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                          Náhled
                        </Link>
                        <Link href={`/admin/upravit/${vehicle.id}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                          Upravit
                        </Link>
                        <form action={deleteAction}>
                          <button type="submit" className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50">
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
