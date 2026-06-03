import {
  DataGridTextCell,
  priceToUcent,
  useCatalogPrice,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TResourceUsage } from '@/api/hook/useConsumption';

export function useFileStorageSnapshotListColumns() {
  const { t } = useTranslation(
    'consumption/hourly-instance/file-storage-snapshot',
  );

  const { getTextPrice } = useCatalogPrice(2);
  const { translateMicroRegion } = useTranslatedMicroRegions();

  return [
    {
      id: 'name',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>{row.name}</DataGridTextCell>
      ),
      label: t('cpbc_file_storage_snapshot_col_name'),
    },
    {
      id: 'region',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>{translateMicroRegion(row.region)}</DataGridTextCell>
      ),
      label: t('cpbc_file_storage_snapshot_col_region'),
    },
    {
      id: 'price',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>
          {getTextPrice(priceToUcent(row.totalPrice ?? 0))}
        </DataGridTextCell>
      ),
      label: t('cpbc_file_storage_snapshot_col_price'),
    },
  ];
}
