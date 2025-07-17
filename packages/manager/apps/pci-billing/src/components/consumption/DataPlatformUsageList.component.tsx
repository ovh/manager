import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { TResourceUsage } from '@/api/hook/useConsumption';
import {
  getHourlyQuantity,
  ResourcesColumn,
  useResourceUsageListColumns,
} from './useResourceUsageListColumns';
import CommonUsageList from './CommonUsageList';
import { useMemo } from 'react';

type DataPlatformUsageListProps = {
  resourcesUsage: TResourceUsage[];
  disabledColumns?: ResourcesColumn[];
};

const getComputedValue = (row: TResourceUsage, t: TFunction) => {
  const { value, unit } = row.quantity;
  if (unit === 'Minute' || unit === 'Hour') {
    const unitValue = getHourlyQuantity(row.quantity);
    return t('pci_billing_private_registry_consumption_value', {
      value: unitValue,
    });
  }
  return `${value.toFixed(2)} ${unit}`;
};

export default function DataPlatformUsageList({
  resourcesUsage,
  disabledColumns,
}: Readonly<DataPlatformUsageListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/resource-usage');
  const columns = useResourceUsageListColumns({ disabledColumns });

  const modifiedColumns = useMemo(
    () =>
      columns.map((column) => {
        if (column.id === ResourcesColumn.consumption) {
          return {
            ...column,
            cell: (row: TResourceUsage) => {
              const value = getComputedValue(row, t);
              return <DataGridTextCell>{value}</DataGridTextCell>;
            },
          };
        }
        return column;
      }),
    [columns, t],
  );

  return (
    <CommonUsageList
      resourcesUsage={resourcesUsage}
      columns={modifiedColumns}
    />
  );
}
