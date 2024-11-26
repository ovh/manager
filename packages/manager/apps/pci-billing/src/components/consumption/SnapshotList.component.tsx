import {
  Datagrid,
  DataGridTextCell,
  useDataGrid,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TSnapshot } from '@/api/hook/useConsumption';
import { paginateResults } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import TooltipIcon from './TooltipIcon.component';

type SnapshotListProps = {
  snapshots: TSnapshot[];
};

export default function SnapshotList({
  snapshots,
}: Readonly<SnapshotListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/snapshot');
  const { currency } = useContext(ShellContext).environment.getUser();

  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { pagination, setPagination } = useDataGrid();

  const getSnapshotPriceInfoTooltip = (snapshot: TSnapshot) =>
    `${t('cpbc_snapshot_col_usage_info_part1')} ${t(
      'cpbc_snapshot_col_usage_info_part2',
      {
        amount: (snapshot.instance?.quantity?.value || 0).toFixed(2),
      },
    )}`;

  const paginatedSnapshots = useMemo(
    () => paginateResults(snapshots || [], pagination),
    [snapshots, pagination, setPagination],
  );

  const columns = [
    {
      id: 'location',
      cell: (row: TSnapshot) => (
        <DataGridTextCell>{translateMicroRegion(row?.region)}</DataGridTextCell>
      ),
      label: t('cpbc_snapshot_col_location'),
    },
    {
      id: 'type',
      cell: () => (
        <DataGridTextCell>{t('cpbc_snapshot_type_instance')}</DataGridTextCell>
      ),
      label: t('cpbc_snapshot_col_type'),
    },
    {
      id: 'usage',
      cell: (row: TSnapshot) => (
        <div className="flex gap-2">
          <DataGridTextCell>
            {`${row?.totalPrice.toFixed(2)} ${currency.symbol}`}
          </DataGridTextCell>
          <TooltipIcon
            icon={ODS_ICON_NAME.HELP}
            content={getSnapshotPriceInfoTooltip(row)}
          />
        </div>
      ),
      label: t('cpbc_snapshot_col_usage'),
    },
  ];

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
