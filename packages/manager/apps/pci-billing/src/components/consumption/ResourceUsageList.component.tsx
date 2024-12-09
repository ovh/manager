import { Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { paginateResults } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import { TResourceUsage } from '@/api/hook/useConsumption';
import { useResourceUsageListColumns } from './useResourceUsageListColumns';

type ResourceUsageListProps = {
  resourcesUsage: TResourceUsage[];
};

export default function ResourceUsageList({
  resourcesUsage,
}: Readonly<ResourceUsageListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/resource-usage');
  const { pagination, setPagination } = useDataGrid();
  const columns = useResourceUsageListColumns();

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
    <div className="my-3">
      <Datagrid
        columns={columns}
        items={paginatedResourcesUsage.rows}
        totalItems={paginatedResourcesUsage.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
