import { useMemo } from 'react';
import { Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { paginateResults } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import { TResourceUsage } from '@/api/hook/useConsumption';
import { useFileStorageSnapshotListColumns } from './useFileStorageSnapshotListColumns';

type FileStorageSnapshotListProps = {
  snapshots: TResourceUsage[];
};

export default function FileStorageSnapshotList({
  snapshots,
}: Readonly<FileStorageSnapshotListProps>) {
  const { t } = useTranslation(
    'consumption/hourly-instance/file-storage-snapshot',
  );
  const { pagination, setPagination } = useDataGrid();
  const columns = useFileStorageSnapshotListColumns();

  const paginatedSnapshots = useMemo(() => {
    const sortedSnapshots = [...(snapshots ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    return paginateResults(sortedSnapshots, pagination);
  }, [snapshots, pagination, setPagination]);

  if (paginatedSnapshots.totalRows === 0) {
    return <NoDataMessage message={t('cpbc_no_consumption_data')} />;
  }

  return (
    <div className="my-3">
      <Datagrid
        columns={columns}
        items={paginatedSnapshots.rows}
        totalItems={paginatedSnapshots.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
