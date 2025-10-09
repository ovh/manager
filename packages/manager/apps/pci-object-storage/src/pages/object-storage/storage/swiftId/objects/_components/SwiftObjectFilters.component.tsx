import { useTranslation } from 'react-i18next';
import { FilterCategories } from '@/lib/filters';

export const getFilters = () => {
  const { t } = useTranslation('pci-object-storage/storages/swift/objects');
  return [
    {
      id: 'name',
      label: t('tableHeaderName'),
      comparators: FilterCategories.String,
    },
    {
      id: 'type',
      label: t('tableHeaderType'),
      comparators: FilterCategories.String,
    },
    {
      id: 'lastModified',
      label: t('tableHeaderUpdateDate'),
      comparators: FilterCategories.Date,
    },
  ];
};
