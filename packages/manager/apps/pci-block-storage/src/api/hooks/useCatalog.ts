import { queryOptions, useQuery } from '@tanstack/react-query';
import { getCatalog } from '@ovh-ux/manager-pci-common';
import { pipe } from 'lodash/fp';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  getPricingSpecsFromModelPricings,
  getVolumeModelPricings,
  mapFilterLeastPrice,
  mapFilterTags,
  mapVolumeCatalog,
  TModelAttach,
  TModelAvailabilityZones,
  TModelName,
  TModelPrice,
} from '@/api/select/catalog';
import { getVolumeCatalog, TVolumeCatalog } from '@/api/data/catalog';
import { EncryptionType } from '@/api/select/volume';

export const getCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: ['catalog'],
  queryFn: () => getCatalog(ovhSubsidiary),
});

export const getVolumeCatalogQuery = (projectId: string) =>
  queryOptions({
    queryKey: ['projects', projectId, 'catalog', 'volume'],
    queryFn: () => getVolumeCatalog(projectId),
  });

export const useVolumeCatalog = (projectId: string) =>
  useQuery(getVolumeCatalogQuery(projectId));

export const useVolumeRegions = (projectId: string) => {
  const { t } = useTranslation(['add', 'order-price', NAMESPACES.BYTES]);
  const { getFormattedCatalogPrice } = useCatalogPrice(6, {
    hideTaxLabel: true,
  });

  const selectVolumeRegions = useCallback(
    (catalog?: TVolumeCatalog) => {
      if (!catalog) {
        return {
          regions: [],
          deployments: [],
        };
      }

      return {
        regions: catalog.regions,
        deployments: catalog.filters.deployment.map(
          pipe(
            mapFilterTags,
            mapFilterLeastPrice(
              catalog.regions,
              catalog.models,
              getFormattedCatalogPrice,
              t,
            ),
          ),
        ),
      };
    },
    [t, getFormattedCatalogPrice],
  );

  const { data, ...restQuery } = useQuery({
    ...getVolumeCatalogQuery(projectId),
  });

  return {
    data: useMemo(() => selectVolumeRegions(data), [data, selectVolumeRegions]),
    ...restQuery,
  };
};

export type TVolumeModel = TModelPrice &
  TModelAvailabilityZones &
  TModelName &
  TModelAttach;

export const useVolumeModels = (projectId: string, region: string) => {
  const { t } = useTranslation(['add', 'common', NAMESPACES.BYTES]);
  const { getFormattedCatalogPrice } = useCatalogPrice(6, {
    hideTaxLabel: true,
  });

  const select = useCallback(
    mapVolumeCatalog(region, getFormattedCatalogPrice, t),
    [region, getFormattedCatalogPrice, t],
  );

  return useQuery({
    ...getVolumeCatalogQuery(projectId),
    select,
  });
};

export const useVolumePricing = (
  projectId: string,
  region: string,
  modelName: TModelName['name'],
  encryptionType?: EncryptionType | null,
  capacity?: number,
) => {
  const { t } = useTranslation(['add', 'common', NAMESPACES.BYTES]);
  const { getFormattedCatalogPrice } = useCatalogPrice(6, {
    hideTaxLabel: true,
  });

  const { data, ...restQuery } = useQuery(getVolumeCatalogQuery(projectId));

  const filteredPricings = useMemo(
    () =>
      getVolumeModelPricings(data)({
        region,
        modelName,
        encryptionType,
      }),
    [data, region, modelName, encryptionType],
  );

  const is3azRegion = useMemo(
    () => !!data?.regions.find((r) => r.name === region),
    [data, region],
  );

  return {
    data: useMemo(
      () =>
        filteredPricings !== null
          ? getPricingSpecsFromModelPricings(
              filteredPricings,
              getFormattedCatalogPrice,
              t,
              capacity,
            )
          : null,
      [filteredPricings, is3azRegion, getFormattedCatalogPrice, t, capacity],
    ),
    ...restQuery,
  };
};

export type Encryption = {
  type: EncryptionType | null;
  label: string;
  comingSoon?: boolean;
};
export const useVolumeEncryptions = () => {
  const { t } = useTranslation('common');

  return {
    data: useMemo<Encryption[]>(
      () => [
        {
          type: null,
          label: t('common:pci_projects_project_storages_blocks_status_NONE'),
        },
        {
          type: EncryptionType.OMK,
          label: 'OVHcloud Managed Key',
        },
        {
          type: EncryptionType.CMK,
          label: 'Customer Managed Key',
          comingSoon: true,
        },
      ],
      [t],
    ),
    defaultValue: EncryptionType.OMK,
  };
};
