import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import { Skeleton, Button, Alert, AlertDescription } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { getColumns } from './ReplicationListColumns.component';
import DataTable from '@/components/data-table';
import { useS3Data } from '../../../S3.context';
import storages from '@/types/Storages';
import { useGetAvailableDestinationsContainers } from '../form/useGetAvailableDestinationsContainers.hook';
import { hasDeletedDestination } from './replicationRules.utils';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';

interface ReplicationListProps {
  replicationRules: storages.ReplicationRule[];
}

const ReplicationList = ({
  replicationRules,
}: Readonly<ReplicationListProps>) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');
  const navigate = useNavigate();
  const { s3 } = useS3Data();

  const { data: featuresAvailable } = useFeatureAvailability([
    'pci-object-storage:replication-job',
  ]);

  const isReplicationJobFeatureAvailable = featuresAvailable?.['pci-object-storage:replication-job'];

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

  const hasInconsistentRules = replicationRules.some(hasDeletedDestination);
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
      {hasInconsistentRules && (
        <Alert variant="warning">
          <AlertDescription className="flex gap-2 items-center">
            <AlertTriangle className="size-4" />
            {t('inconsistentReplicationRulesAlert')}
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
              availableDestinations.length === 0 ||
              hasInconsistentRules
            }
          >
            <Plus className="size-6" />
            {t('createReplication')}
          </Button>
          {isReplicationJobFeatureAvailable && (
            <Button
              variant="neutral"
              mode="outline"
              onClick={() => {
                navigate('./storage-job');
              }}
              disabled={replicationRules.length === 0}
            >
              <RefreshCw className="size-4 mr-2" />
              {t('createSyncRule')}
            </Button>
          )}
        </DataTable.Action>
        <DataTable.SearchBar />
      </DataTable.Header>
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable.Provider>
  );
};

ReplicationList.Skeleton = () => (
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

export default ReplicationList;
