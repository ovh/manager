import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';

import { ai } from '@/models/types';
import { getRegistriesColumns } from './registriesListColumn';
import DeleteRegistryModal, { DeleteRegistrySubmitData } from './deleteRegistryModal';


interface RegistriesListProps {
  registries: ai.registry.Registry[];
  onDeleteSubmit: (data: DeleteRegistrySubmitData) => void;
}

export default function RegistriesList({
  registries,
  onDeleteSubmit,
}: RegistriesListProps) {
  // define state
  const [isOpenModal, setOpenModal] = useState(false);
  const [deletingRegistry, setDeletingRegistry] = useState<ai.registry.Registry>();

  const columns: ColumnDef<ai.registry.Registry>[] = getRegistriesColumns({
    onDeleteClicked: (registry: ai.registry.Registry) => {
      setDeletingRegistry(registry);
      setOpenModal(true);
    },
  });

  const onDeleteRegistrySubmit = (data: DeleteRegistrySubmitData) => {
    onDeleteSubmit(data);
    setOpenModal(false);
  };

  const handleCloseDeleteRegistryModal = () => {
    setOpenModal(false);
    setDeletingRegistry(undefined);
  };

  return (
    <>
      <div>
        <DataTable columns={columns} data={registries} pageSize={5} />
      </div>
      {deletingRegistry && (
        <DeleteRegistryModal
          registry={deletingRegistry}
          open={isOpenModal}
          onClose={handleCloseDeleteRegistryModal}
          onSubmit={onDeleteRegistrySubmit}
        />
      )}
    </>
  );
}

RegistriesList.Skeleton = function RegistriesListSkeleton() {
  return (
    <>
      <div className="flex justify-between w-100 mb-2 items-end">
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-12 ml-2" />
        </div>
      </div>
      <DataTable.Skeleton columns={5} rows={10} width={100} height={16} />
    </>
  );
};
