import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  TContinent,
  TProductAvailabilityRegion,
  TRegion,
  TRegionType,
  useProductAvailability,
} from '@ovh-ux/manager-pci-common';
import { getMacroRegion, useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';

import { isLocalDeploymentZone } from '@/helpers';
import { TLocation, TProjectLocation } from '@/types/region';

import { getProjectRegions } from '../../api/data/regions';

export const getRegionQueryKey = (projectId: string) => ['project', projectId, 'region'];

const extractBaseAndId = (name: string): [string, number] => {
  const base = name.replace(/[\d]+/, '');
  const id = parseInt(name.replace(/[^\d]+/, ''), 10) || 0;
  return [base, id];
};

const sortRegions = (a: TLocation, b: TLocation): number => {
  const [baseA, idA] = extractBaseAndId(a.name);
  const [baseB, idB] = extractBaseAndId(b.name);

  return baseA === baseB ? idA - idB : baseA.localeCompare(baseB);
};

const getUniqueContinents = (regions: TLocation[]): TContinent[] => {
  const seen = new Set<string>();
  return regions
    .filter((r) => {
      const key = r.continentLabel;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((r) => ({
      id: r.macro,
      code: r.continentCode,
      name: r.continentLabel,
    }));
};

const buildLocalisationData = (
  projectRegions: TRegion[],
  allRegions: TProductAvailabilityRegion[],
  translate: ReturnType<typeof useTranslatedMicroRegions>,
  tAllLabel: string,
): TProjectLocation => {
  const enabledNames = new Set(projectRegions.map((r) => r.name));
  const mergedRegions = [...projectRegions, ...allRegions.filter((r) => !enabledNames.has(r.name))];

  const { translateMicroRegion, translateMacroRegion, translateContinentRegion } = translate;

  const regions: TLocation[] = mergedRegions
    .map((region) => {
      const macro = getMacroRegion(region.name);
      return {
        ...region,
        enabled: (region as TProductAvailabilityRegion).enabled ?? true,
        isMacro: region.name === macro,
        isLocalZone: isLocalDeploymentZone(
          region.type as Extract<TRegionType, 'region' | 'localzone' | 'region-3-az'>,
        ),
        macro,
        macroLabel: translateMacroRegion(region.name) || macro,
        microLabel: translateMicroRegion(region.name) || region.name,
        continentLabel: translateContinentRegion(region.name) || macro,
        datacenterLocation: (region as TRegion).datacenterLocation ?? '',
        services: (region as TRegion).services ?? [],
        status: (region as TRegion).status,
      };
    })
    .sort(sortRegions);

  const uniqueContinents = getUniqueContinents(regions);

  return {
    regions,
    continents: [{ id: 'WORLD', code: 'WORLD', name: tAllLabel }, ...uniqueContinents],
  };
};

export const useProjectLocalisation = (projectId: string, product: string) => {
  const { t } = useTranslation('region-selector');
  const translate = useTranslatedMicroRegions();

  const { data: availability, isPending: isPendingAvailability } = useProductAvailability(
    projectId,
    {
      product,
    },
  );

  const { data: projectRegions, isPending: isPendingRegions } = useQuery({
    queryKey: getRegionQueryKey(projectId),
    queryFn: () => getProjectRegions(projectId),
  });

  const isPending = isPendingAvailability || isPendingRegions;

  const regions = availability?.products?.[0]?.regions;

  const localisationData = useMemo(() => {
    if (!projectRegions || !regions) return null;

    return buildLocalisationData(
      projectRegions,
      regions,
      translate,
      t('pci_project_regions_list_continent_all'),
    );
  }, [regions, projectRegions, t]);

  return {
    localisationData,
    isPending,
  };
};
