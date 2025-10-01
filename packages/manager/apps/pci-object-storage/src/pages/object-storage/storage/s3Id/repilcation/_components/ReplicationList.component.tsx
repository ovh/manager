import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Skeleton, Button } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { getColumns } from './ReplicationListColumns.component';
import DataTable from '@/components/data-table';
import { useS3Data } from '../../S3.context';
import storages from '@/types/Storages';

interface ReplicationListProps {
  replicationRules: storages.ReplicationRule[];
}

export default function ReplicationList({
  replicationRules,
}: Readonly<ReplicationListProps>) {
  const { t } = useTranslation('pci-object-storage/replication');
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

  return (
    <DataTable.Provider columns={columns} data={replicationRules} pageSize={25}>
      <DataTable.Header>
        <DataTable.Action>
          <Button
            data-testid="create-replication-button"
            onClick={() => {
              navigate('./new');
            }}
            disabled={!isVersioningEnabled}
          >
            <Plus className="size-6 mr-2 text-primary-foreground" />
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
