import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { database } from '@/models/database';
import { Skeleton } from '@/components/ui/skeleton';

import UpdateServiceNameModal, {
  UpdateServiceSubmitData,
} from './updateServiceNameModal';
import { getColumns } from './serviceListColumns';
import { H2 } from '@/components/typography';
import { useLocale } from '@/hooks/useLocale';
import { UpdateServiceProps, updateService } from '@/data/cdb/service';

interface ServicesListProps {
  services: database.Service[];
  projectId: string;
  refetchFn: () => void;
}

export default function ServicesList({
  services,
  projectId,
  refetchFn,
}: ServicesListProps) {
  // define state
  const [isOpenModal, setOpenModal] = useState(false);
  const [editingService, setEditingService] = useState<database.Service>();
  const lang = useLocale();

  // define api links
  const updateServiceNameMutation = useMutation({
    mutationFn: (mutationData: UpdateServiceProps) =>
      updateService(mutationData),
    onSuccess: () => {
      // close modale
      setOpenModal(false);
      // refresh services list
      refetchFn();
    },
  });

  const columns: ColumnDef<database.Service>[] = getColumns({
    onRenameClicked: (service: database.Service) => {
      setEditingService(service);
      setOpenModal(true);
    },
    lang: lang.replace('_', '-'),
  });

  const onSubmit = (data: UpdateServiceSubmitData) => {
    updateServiceNameMutation.mutate({
      projectId,
      serviceEngine: data.serviceEngine,
      serviceId: data.serviceId,
      data: {
        description: data.description,
      },
    });
  };

  const handleCloseUpdateServiceNameModal = () => {
    setOpenModal(false);
    setEditingService(undefined);
  };

  return (
    <>
      <H2>Services</H2>
      <>
        <div>
          <div className="flex justify-between w-100 mb-2 items-end">
            <Button variant="outline" size="sm" asChild>
              <Link to="./create">
                <Plus className="w-4 h-4 mr-2" /> Create a new service
              </Link>
            </Button>
          </div>
          <DataTable columns={columns} data={services} pageSize={25} />
        </div>
        {editingService && (
          <UpdateServiceNameModal
            service={editingService}
            open={isOpenModal}
            onClose={handleCloseUpdateServiceNameModal}
            disabled={updateServiceNameMutation.status === 'pending'}
            onSubmit={onSubmit}
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
