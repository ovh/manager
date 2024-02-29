import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';

import { getDatastoresColumns } from './datastoresListColumn';
import DeleteDatastoreModal, { DeleteDatastoreSubmitData } from './deleteDatastoreModal';
import { DataStoreWithRegion } from '@/hooks/api/ai/useGetDatastores';


interface DatastoresListProps {
  datastores: DataStoreWithRegion[];
  onDeleteSubmit: (data: DeleteDatastoreSubmitData) => void;
}

export default function DatastoresList({
  datastores,
  onDeleteSubmit,
}: DatastoresListProps) {
  // define state
  const [isOpenModal, setOpenModal] = useState(false);
  const [deletingDatastore, setDeletingDatastore] = useState<DataStoreWithRegion>();

  const columns: ColumnDef<DataStoreWithRegion>[] = getDatastoresColumns({
    onDeleteClicked: (datastore: DataStoreWithRegion) => {
      setDeletingDatastore(datastore);
      setOpenModal(true);
    },
  });

  const onDeleteDatastoreSubmit = (data: DeleteDatastoreSubmitData) => {
    onDeleteSubmit(data);
    setOpenModal(false);
  };

  const handleCloseDeleteDatastoreModal = () => {
    setOpenModal(false);
    setDeletingDatastore(undefined);
  };

  return (
    <>
      <div>
        <DataTable columns={columns} data={datastores} pageSize={5} />
      </div>
      {deletingDatastore && (
        <DeleteDatastoreModal
          datastore={deletingDatastore}
          open={isOpenModal}
          onClose={handleCloseDeleteDatastoreModal}
          onSubmit={onDeleteDatastoreSubmit}
        />
      )}
    </>
  );
}

DatastoresList.Skeleton = function DatastoresListSkeleton() {
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
