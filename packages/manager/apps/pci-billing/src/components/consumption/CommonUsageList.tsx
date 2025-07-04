import {
  Datagrid,
  DatagridColumn,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { paginateResults } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import { TResourceUsage } from '@/api/hook/useConsumption';

type TCommonUsageListProps = {
  resourcesUsage: TResourceUsage[];
  columns: DatagridColumn<TResourceUsage>[];
};

export default function CommonUsageList({
  resourcesUsage,
  columns,
}: Readonly<TCommonUsageListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/resource-usage');
  const { pagination, setPagination } = useDataGrid();

  const paginatedResourcesUsage = useMemo(() => {
    const sortedResources = resourcesUsage.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    return paginateResults(sortedResources || [], pagination);
  }, [resourcesUsage, pagination, setPagination]);

  if (paginatedResourcesUsage.totalRows === 0) {
    return (
      <NoDataMessage message={t('pci_billing_private_registry_no_entry')} />
    );
  }

  return (
    <Datagrid
      className="my-3"
      columns={columns}
      items={paginatedResourcesUsage.rows}
      totalItems={paginatedResourcesUsage.totalRows}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  );
}
