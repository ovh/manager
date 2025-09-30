import { useTranslation } from 'react-i18next';
import { RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud/index';
import { FilterCategories } from '@/lib/filters';
import { REGIONS_OPTIONS } from './StorageListFilters.constants';

export const getFilters = () => {
  const { t } = useTranslation('pci-object-storage/storages');
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
    {
      id: 'regionType',
      label: t('tableHeaderDeploymentMode'),
      comparators: FilterCategories.Options,
      options: Object.values(RegionTypeEnum).map((rType) => ({
        label: rType,
        value: rType,
      })),
    },
  ];
};
