import {
  Datagrid,
  DataGridTextCell,
  useDataGrid,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { COLD_ARCHIVE_FEE_TYPES } from '@/constants';
import { paginateResults, TQuantity } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import { TResourceUsage } from '@/api/hook/useConsumption';

type ResourceUsageListProps = {
  resourcesUsage: TResourceUsage[];
};

export default function ResourceUsageList({
  resourcesUsage,
}: Readonly<ResourceUsageListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/resource-usage');
  const { currency } = useContext(ShellContext).environment.getUser();

  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { pagination, setPagination } = useDataGrid();

  const hourlyQuantity = (quantity: TQuantity) => {
    switch (quantity?.unit) {
      case 'Minute':
        return (quantity?.value / 60).toFixed(2);
      case 'Hour':
      default:
        return quantity?.value;
    }
  };

  const columns = [
    {
      id: 'region',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>{translateMicroRegion(row?.region)}</DataGridTextCell>
      ),
      label: t('pci_billing_private_registry_region'),
    },
    {
      id: 'type',
      cell: (row: TResourceUsage) => (
        <div>
          <DataGridTextCell>
            {COLD_ARCHIVE_FEE_TYPES.includes(row.name)
              ? t(
                  `pci_billing_private_registry_type_cold_archive_${row.name}_label`,
                )
              : row.name}
          </DataGridTextCell>
        </div>
      ),
      label: t('pci_billing_private_registry_type'),
    },
    {
      id: 'consumption',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>
          {t('pci_billing_private_registry_consumption_value', {
            value: hourlyQuantity(row.quantity),
          })}
        </DataGridTextCell>
      ),
      label: t('pci_billing_private_registry_consumption'),
    },
    {
      id: 'price',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>
          {row?.totalPrice.toFixed(2)} {currency.symbol}
        </DataGridTextCell>
      ),
      label: t('pci_billing_private_registry_price'),
    },
  ];

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
