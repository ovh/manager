import {
  DataGridTextCell,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { COLD_ARCHIVE_FEE_TYPES } from '@/constants';
import { TQuantity } from '@/api/data/consumption';
import { TResourceUsage } from '@/api/hook/useConsumption';

export enum ResourcesColumn {
  region = 'region',
  type = 'type',
  consumption = 'consumption',
  price = 'price',
}

export const getHourlyQuantity = (quantity: TQuantity) => {
  switch (quantity.unit) {
    case 'Minute':
      return (quantity.value / 60).toFixed(2);
    case 'Hour':
    default:
      return quantity.value;
  }
};

export function useResourceUsageListColumns({
  disabledColumns,
}: { disabledColumns?: ResourcesColumn[] } = {}) {
  const { t } = useTranslation('consumption/hourly-instance/resource-usage');
  const { currency } = useContext(ShellContext).environment.getUser();
  const { translateMicroRegion } = useTranslatedMicroRegions();

  return [
    {
      id: ResourcesColumn.region,
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>{translateMicroRegion(row?.region)}</DataGridTextCell>
      ),
      label: t('pci_billing_private_registry_region'),
    },
    {
      id: ResourcesColumn.type,
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
      id: ResourcesColumn.consumption,
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>
          {t('pci_billing_private_registry_consumption_value', {
            value: getHourlyQuantity(row.quantity),
          })}
        </DataGridTextCell>
      ),
      label: t('pci_billing_private_registry_consumption'),
    },
    {
      id: ResourcesColumn.price,
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>
          {row?.totalPrice.toFixed(2)} {currency.symbol}
        </DataGridTextCell>
      ),
      label: t('pci_billing_private_registry_price'),
    },
  ].filter((column) => !disabledColumns?.includes(column.id));
}
