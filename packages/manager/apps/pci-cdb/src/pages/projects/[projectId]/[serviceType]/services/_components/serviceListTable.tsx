import { useMutation } from '@tanstack/react-query';
import { Plus, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { database } from '@/models/database';
import { UpdateServiceProps, cdbApi } from '@/data/cdbapi';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

import UpdateServiceNameModal, {
  UpdateServiceSubmitData,
} from './updateServiceNameModal';
import { getColumns } from './serviceListColumns';
import { H2 } from '@/components/typography';

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

  // define api links

  const updateServiceNameMutation = useMutation({
    mutationFn: (mutationData: UpdateServiceProps) =>
      cdbApi.updateService(mutationData),
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
            <div className="flex">
              <Input
                type="text"
                id="search"
                placeholder="Search a service"
                className="mr-2"
              />
              <Button variant="outline" onClick={() => refetchFn()}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DataTable columns={columns} data={services} pageSize={5} />
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
