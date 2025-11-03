import { useTranslation } from 'react-i18next';
import { FilterCategories } from '@/lib/filters';

export const getFilters = () => {
  const { t } = useTranslation('pci-object-storage/users');
  return [
    {
      id: 'username',
      label: t('tableHeaderName'),
      comparators: FilterCategories.String,
    },
  ];
};
