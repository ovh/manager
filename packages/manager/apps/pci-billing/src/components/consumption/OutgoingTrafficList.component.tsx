import { Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TInstanceBandWith } from '@/api/hook/useConsumption';
import { paginateResults } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import { useOutgoingTrafficListColumns } from './useOutgoingTrafficListColumns';

export default function OutgoingTrafficList({
  instanceBandwidths,
}: Readonly<{
  instanceBandwidths: TInstanceBandWith[];
}>) {
  const { t } = useTranslation('consumption/hourly-instance/outgoing-traffic');
  const { pagination, setPagination } = useDataGrid();
  const columns = useOutgoingTrafficListColumns();

  const paginatedInstanceBandWidths = useMemo(
    () => paginateResults(instanceBandwidths || [], pagination),
    [instanceBandwidths, pagination, setPagination],
  );

  if (paginatedInstanceBandWidths.totalRows === 0) {
    return <NoDataMessage message={t('cpbc_no_consumption_data')} />;
  }

  return (
    <div className="my-3">
      <Datagrid
        columns={columns}
        items={paginatedInstanceBandWidths.rows}
        totalItems={paginatedInstanceBandWidths.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
