import { useMemo } from 'react';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { getVolumeCatalogQuery } from '@/api/hooks/useCatalog';
import { getVolumeQuery } from '@/api/hooks/useVolume';
import {
  mapRetypingVolumeCatalog,
  TModelAttach,
  TModelAvailabilityZones,
  TModelName,
  TModelPreselection,
  TModelPrice,
} from '@/api/select/catalog';
import { getEncryption } from '@/api/select/volume';

export type TVolumeRetypeModel = TModelPrice &
  TModelAvailabilityZones &
  TModelName &
  TModelAttach &
  TModelPreselection;

export const useCatalogWithPreselection = (
  projectId: string,
  volumeId: string,
) => {
  const [
    { data: volumeData, ...restVolumeQuery },
    { data: catalogData, ...restCatalogQuery },
  ] = useQueries({
    queries: [
      getVolumeQuery(projectId, volumeId),
      getVolumeCatalogQuery(projectId),
    ],
  });
  const { t } = useTranslation(['common', 'add', NAMESPACES.BYTES]);
  const { getFormattedCatalogPrice } = useCatalogPrice(6, {
    hideTaxLabel: true,
  });

  const [data, preselectedEncryptionType] = useMemo(() => {
    if (!catalogData || !volumeData) return [null, null];

    const regionType = catalogData?.regions.find(
      (region) => region.name === volumeData?.region,
    )?.type;

    if (
      regionType === 'region-3-az' &&
      volumeData.type === 'classic-multiattach'
    ) {
      return [[], null];
    }

    return [
      mapRetypingVolumeCatalog(
        volumeData.region,
        getFormattedCatalogPrice,
        t,
        volumeData?.type,
      )(catalogData),
      getEncryption(catalogData)(volumeData).encryptionType,
    ];
  }, [volumeData, catalogData, getFormattedCatalogPrice, t]);

  return {
    data,
    preselectedEncryptionType,
    isPending: restVolumeQuery.isPending || restCatalogQuery.isPending,
  };
};
