import { useMemo, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { TContinent } from '@ovh-ux/manager-pci-common';
import { getMacroRegion, useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';

import { isLocalDeploymentZone } from '@/helpers';
import { TLocation, TProjectLocation, TRegion, TRegionCodes } from '@/types/region';

import { getProjectRegions } from '../../api/data/regions';
import usePlanToRegionAvailability from './usePlanToRegionAvailability';

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
  productRegions: TRegionCodes[],
  translate: ReturnType<typeof useTranslatedMicroRegions>,
  tAllLabel: string,
): TProjectLocation => {
  const enabledNames = new Set(projectRegions.map((r) => r.name));
  const productRegionsByName = new Map(productRegions.map((r) => [r.name, r]));
  const mergedRegions = [
    ...projectRegions.map((r) => ({
      ...r,
      codes: productRegionsByName.get(r.name)?.codes,
    })),
    ...productRegions.filter((r) => !enabledNames.has(r.name)),
  ];

  const { translateMicroRegion, translateMacroRegion, translateContinentRegion } = translate;

  const regions = mergedRegions
    .map((region: TRegionCodes | TRegion) => {
      const macro = getMacroRegion(region.name);
      return {
        ...region,
        enabled: region.enabled ?? true,
        isMacro: region.name === macro,
        isLocalZone: isLocalDeploymentZone(region.type),
        macro,
        codes: (region as TRegionCodes).codes ?? null,
        macroLabel: translateMacroRegion(region.name) || macro,
        microLabel: translateMicroRegion(region.name) || region.name,
        continentLabel: translateContinentRegion(region.name) || macro,
        countryCode: (region as TRegion).countryCode,
        ipCountries: (region as TRegion).ipCountries,
        services: (region as TRegion).services ?? [],
        status: (region as TRegion).status,
      } satisfies TLocation;
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
  // FIXME remove this hack when we have a better way to handle translations
  const translateRef = useRef(translate);

  const { data: availability, isPending: isPendingAvailability } = usePlanToRegionAvailability(
    projectId,
    product,
  );

  const { data: projectRegions, isPending: isPendingRegions } = useQuery({
    queryKey: getRegionQueryKey(projectId),
    queryFn: () => getProjectRegions(projectId),
  });
  const isPending = isPendingAvailability || isPendingRegions;

  const localisationData = useMemo(() => {
    if (!projectRegions || !availability) return null;

    return buildLocalisationData(
      projectRegions,
      availability,
      translateRef.current,
      t('pci_project_regions_list_continent_all'),
    );
  }, [projectRegions, availability, t]);

  return {
    localisationData,
    isPending,
  };
};
