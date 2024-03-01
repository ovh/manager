import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { database } from '@/models/database';
import { Skeleton } from '@/components/ui/skeleton';
import { getColumns } from './serviceListColumns';
import { H2, Link } from '@/components/typography';
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
  const { t } = useTranslation('pci-databases-analytics/services');

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
      <H2>{t('title')}</H2>
      <>
        <div>
          <div className="flex justify-between w-100 mb-2 items-end">
            <Button variant="outline" size="sm" className="text-base" asChild>
              <Link to="./new" className="hover:no-underline">
                <Plus className="w-4 h-4 mr-2" />
                {t('create-new-service')}
              </Link>
            </Button>
          </div>
          <DataTable columns={columns} data={services} pageSize={25} />
        </div>

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
