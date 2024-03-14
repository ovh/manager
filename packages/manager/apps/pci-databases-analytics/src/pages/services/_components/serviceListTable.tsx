import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { database } from '@/models/database';
import { Skeleton } from '@/components/ui/skeleton';
import { getColumns } from './serviceListColumns';
import { useModale } from '@/hooks/useModale';
import RenameService from '../[serviceId]/_components/renameService';

interface ServicesListProps {
  services: database.Service[];
  refetchFn: () => void;
}

export default function ServicesList({
  services,
  refetchFn,
}: ServicesListProps) {
  const renameModale = useModale('rename');
  const editingService = useMemo(
    () => services.find((s) => s.id === renameModale.value),
    [renameModale.value, services],
  );

  const columns: ColumnDef<database.Service>[] = getColumns({
    onRenameClicked: (service: database.Service) => {
      renameModale.open(service.id);
    },
  });

  return (
    <>
      <DataTable columns={columns} data={services} pageSize={25} />
      {editingService && (
        <RenameService
          controller={renameModale.controller}
          service={editingService}
          onSuccess={() => {
            renameModale.close();
            refetchFn();
          }}
        />
      )}
    </>
  );
}

ServicesList.Skeleton = function ServicesListSkeleton() {
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
