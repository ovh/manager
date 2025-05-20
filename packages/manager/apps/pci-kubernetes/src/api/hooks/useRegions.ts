import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  getMacroRegion,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import {
  TContinent,
  TLocalisation as TLocPCi,
  TProductAvailabilityRegion,
  TRegion,
  useProductAvailability,
} from '@ovh-ux/manager-pci-common';
import { getProjectRegions } from '../../api/data/regions';
import { DeploymentMode } from '@/types';
import { isLocalDeploymentZone } from '@/helpers';

export type TLocalisation = TLocPCi & { enabled?: boolean };

export interface ProjectLocalisation {
  regions: TLocalisation[];
  continents: TContinent[];
}

export const getRegionQueryKey = (projectId: string) => [
  'project',
  projectId,
  'region',
];

const extractBaseAndId = (name: string): [string, number] => {
  const base = name.replace(/[\d]+/, '');
  const id = parseInt(name.replace(/[^\d]+/, ''), 10) || 0;
  return [base, id];
};

const sortRegions = (a: TLocalisation, b: TLocalisation): number => {
  const [baseA, idA] = extractBaseAndId(a.name);
  const [baseB, idB] = extractBaseAndId(b.name);

  return baseA === baseB ? idA - idB : baseA.localeCompare(baseB);
};

const getUniqueContinents = (regions: TLocalisation[]): TContinent[] => {
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
  translate: {
    macro: (regionName: string) => string;
    micro: (regionName: string) => string;
    continent: (regionName: string) => string;
  },
  tAllLabel: string,
): ProjectLocalisation => {
  const enabledNames = new Set(projectRegions.map((r) => r.name));
  const mergedRegions = [
    ...projectRegions,
    ...allRegions.filter((r) => !enabledNames.has(r.name)),
  ] as (TRegion & { enabled: boolean })[];

  const regions = mergedRegions
    .map((region) => {
      const macro = getMacroRegion(region.name);
      return {
        ...region,
        enabled: region.enabled ?? true,
        isMacro: region.name === macro,
        isLocalZone: isLocalDeploymentZone(region.type as DeploymentMode),
        macro,
        macroLabel: translate.macro(region.name) || macro,
        microLabel: translate.micro(region.name) || region.name,
        continentLabel: translate.continent(region.name) || macro,
        status:
          region.status ?? region.availabilityZones.length
            ? DeploymentMode.MULTI_ZONES
            : DeploymentMode.MONO_ZONE,
      };
    })
    .sort(sortRegions);

  const uniqueContinents = getUniqueContinents(regions);

  return {
    regions,
    continents: [
      { id: 'WORLD', code: 'WORLD', name: tAllLabel },
      ...uniqueContinents,
    ],
  };
};

export const useProjectLocalisation = (projectId: string) => {
  const { t } = useTranslation('region-selector');
  const {
    translateMicroRegion,
    translateMacroRegion,
    translateContinentRegion,
  } = useTranslatedMicroRegions();

  const { data: availability } = useProductAvailability(projectId, {
    product: 'kubernetes',
  });

  return useQuery({
    queryKey: getRegionQueryKey(projectId),
    queryFn: () => getProjectRegions(projectId),
    enabled: !!availability,
    select: (projectRegions) =>
      buildLocalisationData(
        projectRegions,
        availability.products[0].regions,
        {
          macro: translateMacroRegion,
          micro: translateMicroRegion,
          continent: translateContinentRegion,
        },
        t('pci_project_regions_list_continent_all'),
      ),
  });
};
