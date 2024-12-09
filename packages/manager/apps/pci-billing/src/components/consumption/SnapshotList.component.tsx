import { Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TSnapshot } from '@/api/hook/useConsumption';
import { paginateResults } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import { useSnapshotListColumns } from './useSnapshotListColumns';

type SnapshotListProps = {
  snapshots: TSnapshot[];
};

export default function SnapshotList({
  snapshots,
}: Readonly<SnapshotListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/snapshot');
  const { pagination, setPagination } = useDataGrid();
  const columns = useSnapshotListColumns();

  const paginatedSnapshots = useMemo(
    () => paginateResults(snapshots || [], pagination),
    [snapshots, pagination, setPagination],
  );

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
