import { useTranslation } from 'react-i18next';
import { FilterCategories } from '@/lib/filters';
import { REGIONS_OPTIONS } from './ContainerListFilters.constants';

export const getFilters = () => {
  const { t } = useTranslation('pci-object-storage/containers');
  const { t: tRegions } = useTranslation('regions');
  return [
    {
      id: 'name',
      label: t('tableHeaderName'),
      comparators: FilterCategories.String,
    },
    {
      id: 'region',
      label: t('tableHeaderLocation'),
      comparators: FilterCategories.Options,
      options: REGIONS_OPTIONS.map((region) => ({
        label: tRegions(`region_${region}`),
        value: region,
      })),
    },
  ];
};
