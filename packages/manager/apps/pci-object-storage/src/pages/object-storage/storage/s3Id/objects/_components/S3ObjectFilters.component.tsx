import { useTranslation } from 'react-i18next';
import { FilterCategories } from '@/lib/filters';

export const getFilters = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  return [
    {
      id: 'name',
      label: t('tableHeaderName'),
      comparators: FilterCategories.String,
    },
    {
      id: 'storageClass',
      label: t('tableHeaderStorage'),
      comparators: FilterCategories.String,
    },
    {
      id: 'updateDate',
      label: t('tableHeaderUpdateDate'),
      comparators: FilterCategories.Date,
    },
  ];
};
