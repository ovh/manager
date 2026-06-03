import {
  DataGridTextCell,
  priceToUcent,
  useCatalogPrice,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TResourceUsage } from '@/api/hook/useConsumption';

// A file storage billing row enriched with its share type (e.g. "standard-1az"),
// which is not part of the billing payload and is resolved from the shares list.
export type TShareUsage = TResourceUsage & { type?: string };

export function useFileStorageListColumns() {
  const { t } = useTranslation('consumption/hourly-instance/file-storage');

  const { getTextPrice } = useCatalogPrice(2);
  const { translateMicroRegion } = useTranslatedMicroRegions();

  return [
    {
      id: 'name',
      cell: (row: TShareUsage) => (
        <DataGridTextCell>{row.name}</DataGridTextCell>
      ),
      label: t('cpbc_file_storage_col_name'),
    },
    {
      id: 'type',
      cell: (row: TShareUsage) => (
        <DataGridTextCell>{row.type ?? ''}</DataGridTextCell>
      ),
      label: t('cpbc_file_storage_col_type'),
    },
    {
      id: 'region',
      cell: (row: TShareUsage) => (
        <DataGridTextCell>{translateMicroRegion(row.region)}</DataGridTextCell>
      ),
      label: t('cpbc_file_storage_col_region'),
    },
    {
      id: 'price',
      cell: (row: TShareUsage) => (
        <DataGridTextCell>
          {getTextPrice(priceToUcent(row.totalPrice ?? 0))}
        </DataGridTextCell>
      ),
      label: t('cpbc_file_storage_col_price'),
    },
  ];
}
