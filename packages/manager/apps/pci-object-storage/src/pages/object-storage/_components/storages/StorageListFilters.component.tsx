import { useTranslation } from 'react-i18next';
import { RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud';
import { FilterCategories } from '@/lib/filters';
import { useTranslatedMicroRegions } from '@/hooks/useTranslatedMicroRegions';
import { ObjectStorageTypeEnum } from '@/types/Storages';

export const useGetFilters = (regionNames: string[]) => {
  const { t } = useTranslation('pci-object-storage/storages');
  const { translateMicroRegion } = useTranslatedMicroRegions();
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
      options: regionNames.map((region) => ({
        label: translateMicroRegion(region),
        value: region,
      })),
    },
    {
      id: 'regionObj.type',
      label: t('tableHeaderDeploymentMode'),
      comparators: FilterCategories.Options,
      options: Object.values(RegionTypeEnum).map((rType) => ({
        label: rType,
        value: rType,
      })),
    },
    {
      id: 'storageType',
      label: t('tableHeaderOffer'),
      comparators: FilterCategories.Options,
      options: Object.values(ObjectStorageTypeEnum).map((rType) => ({
        label: rType,
        value: rType,
      })),
    },
  ];
};
