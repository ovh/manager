import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, Plus } from 'lucide-react';
import { Skeleton, Button, Alert, AlertDescription } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { getColumns } from './ReplicationListColumns.component';
import DataTable from '@/components/data-table';
import { useS3Data } from '../../../S3.context';
import storages from '@/types/Storages';
import { useGetAvailableDestinationsContainers } from '../form/useGetDestinationContainers';

interface ReplicationListProps {
  replicationRules: storages.ReplicationRule[];
}

export default function ReplicationList({
  replicationRules,
}: Readonly<ReplicationListProps>) {
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');
  const navigate = useNavigate();
  const { s3 } = useS3Data();

  const columns: ColumnDef<storages.ReplicationRule>[] = getColumns({
    onEditClicked: (replication) => {
      navigate(`./edit/${replication.id}`);
    },
    onDeleteClicked: (replication) => {
      navigate(`./delete/${replication.id}`);
    },
  });

  const isVersioningEnabled =
    s3?.versioning?.status === storages.VersioningStatusEnum.enabled;

  const {
    availableDestinations,
    isLoading,
  } = useGetAvailableDestinationsContainers();

  return (
    <DataTable.Provider columns={columns} data={replicationRules} pageSize={25}>
      {availableDestinations.length === 0 && !isLoading && (
        <Alert variant="warning" data-testid="no-available-destinations-alert">
          <AlertDescription className="flex gap-2 items-center">
            <AlertTriangle className="size-4" />
            {t('noAvailableDestinationContainersAlert')}
          </AlertDescription>
        </Alert>
      )}
      {!isVersioningEnabled && (
        <Alert
          variant="warning"
          data-testid="replication-requires-versioning-alert"
        >
          <AlertDescription className="flex gap-2 items-center">
            <AlertTriangle className="size-4" />
            {t('replicationRequiresVersioningAlert')}
          </AlertDescription>
        </Alert>
      )}
      <DataTable.Header>
        <DataTable.Action>
          <Button
            data-testid="create-replication-button"
            onClick={() => {
              navigate('./new');
            }}
            disabled={
              !isVersioningEnabled ||
              isLoading ||
              availableDestinations.length === 0
            }
          >
            <Plus className="size-6" />
            {t('createReplication')}
          </Button>
        </DataTable.Action>
        <DataTable.SearchBar />
      </DataTable.Header>
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable.Provider>
  );
}

ReplicationList.Skeleton = function ReplicationListSkeleton() {
  return (
    <>
      <div
        data-testid="replication-list-table-skeleton"
        className="flex justify-between w-100 mb-2 items-end"
      >
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
      <DataTable.Skeleton columns={6} rows={10} width={100} height={16} />
    </>
  );
};
