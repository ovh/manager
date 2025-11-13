import { useTranslation } from 'react-i18next';
import { FilterCategories } from '@/lib/filters';

export const getFilters = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  return [
    {
      id: 'key',
      label: t('tableHeaderName'),
      comparators: FilterCategories.String,
    },
    {
      id: 'storageClass',
      label: t('tableHeaderStorageClass'),
      comparators: FilterCategories.String,
    },
    {
      id: 'lastModified',
      label: t('tableHeaderUpdateDate'),
      comparators: FilterCategories.Date,
    },
  ];
};
