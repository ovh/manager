import {
  DataGridTextCell,
  priceToUcent,
  useCatalogPrice,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TQuantity } from '@/api/data/consumption';
import { TLocalStorage } from '@/api/hook/useConsumption';

export type TLocalStorageUsage = TLocalStorage & { instanceName: string };

const formatConsumption = ({ value, unit }: TQuantity) => `${value} ${unit}`;

export function useLocalStorageListColumns() {
  const { t } = useTranslation('consumption/hourly-instance/local-storage');

  const { getTextPrice } = useCatalogPrice(2);
  const { translateMicroRegion } = useTranslatedMicroRegions();

  return [
    {
      id: 'name',
      cell: (row: TLocalStorageUsage) => (
        <DataGridTextCell>{row.reference}</DataGridTextCell>
      ),
      label: t('cpbc_local_storage_col_name'),
    },
    {
      id: 'instance',
      cell: (row: TLocalStorageUsage) => (
        <DataGridTextCell>{row.instanceName}</DataGridTextCell>
      ),
      label: t('cpbc_local_storage_col_instance'),
    },
    {
      id: 'consumption',
      cell: (row: TLocalStorageUsage) => (
        <DataGridTextCell>{formatConsumption(row.quantity)}</DataGridTextCell>
      ),
      label: t('cpbc_local_storage_col_consumption'),
    },
    {
      id: 'region',
      cell: (row: TLocalStorageUsage) => (
        <DataGridTextCell>{translateMicroRegion(row.region)}</DataGridTextCell>
      ),
      label: t('cpbc_local_storage_col_region'),
    },
    {
      id: 'price',
      cell: (row: TLocalStorageUsage) => (
        <DataGridTextCell>
          {getTextPrice(priceToUcent(row.totalPrice ?? 0))}
        </DataGridTextCell>
      ),
      label: t('cpbc_local_storage_col_price'),
    },
  ];
}
