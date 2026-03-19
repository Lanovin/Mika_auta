import { notFound } from "next/navigation";
import { requireAdminAuth } from "@/src/lib/auth";
import { VehicleForm } from "@/src/components/admin/VehicleForm";
import { readVehicleById } from "@/src/lib/vehicle-store";
import { updateVehicleAction } from "@/app/admin/actions";

interface EditVehiclePageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  await requireAdminAuth();
  const vehicle = await readVehicleById(params.id);

  if (!vehicle) {
    notFound();
  }

  const action = updateVehicleAction.bind(null, params.id);

  return (
    <div className="container-page py-10 pb-16">
      <VehicleForm mode="edit" action={action} vehicle={vehicle} />
    </div>
  );
}
