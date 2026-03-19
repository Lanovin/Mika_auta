import { requireAdminAuth } from "@/src/lib/auth";
import { VehicleForm } from "@/src/components/admin/VehicleForm";
import { createVehicleAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function NewVehiclePage() {
  await requireAdminAuth();

  return (
    <div className="container-page py-10 pb-16">
      <VehicleForm mode="create" action={createVehicleAction} />
    </div>
  );
}
