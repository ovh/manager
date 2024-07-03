import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { TRegion, getMacroRegion, getProjectRegions } from '@/api/data/regions';

export const useProjectRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions'],
    queryFn: () => getProjectRegions(projectId),
  });

export interface TContinent {
  id: string; // unique ID
  code: string; // continent code
  name: string; // translated continent name
}

export type TLocalisation = TRegion & {
  isMacro: boolean; // is a macro region ?
  isLocalZone: boolean; // is a localzone ?
  macro: string; // associated macro region code
  continentLabel: string; // WARNING: used to group regions
  macroLabel: string; // translated macro region label
  microLabel: string; // translated micro region label
};

export interface ProjectLocalisation {
  regions: TLocalisation[];
  continents: TContinent[];
}

export const useProjectLocalisation = (projectId: string) => {
  const { i18n, t: tRegion } = useTranslation('region');
  const { t: tLoc } = useTranslation('localisation');

  const getTranslatedMicroRegion = (macro: string, micro: string) => {
    if (i18n.exists(`region:manager_components_region_${macro}_micro`)) {
      return tRegion(`manager_components_region_${macro}_micro`, { micro });
    }
    return null;
  };

  const getTranslatedMacroRegion = (macro: string) => {
    if (i18n.exists(`region:manager_components_region_${macro}`)) {
      return tRegion(`manager_components_region_${macro}`);
    }
    return null;
  };

  const getTranslatedRegionContinent = (macro: string) => {
    if (i18n.exists(`region:manager_components_region_continent_${macro}`)) {
      return tRegion(`manager_components_region_continent_${macro}`);
    }
    return null;
  };

  return useQuery({
    queryKey: ['project', projectId, 'localisation'],
    queryFn: () => getProjectRegions(projectId),
    select: (data): ProjectLocalisation => {
      const regions = data
        .map((region) => {
          const macro = getMacroRegion(region.name);
          return {
            ...region,
            isMacro: region.name === macro,
            macro,
            macroLabel: getTranslatedMacroRegion(macro) || macro,
            microLabel:
              getTranslatedMicroRegion(macro, region.name) || region.name,
            continentLabel: getTranslatedRegionContinent(macro) || macro,
            isLocalZone: region.type === 'localzone',
          };
        })
        .sort(({ name: a }, { name: b }) => {
          const regionA = a.replace(/[\d]+/, '');
          const regionB = b.replace(/[\d]+/, '');
          if (regionA === regionB) {
            const regionIdA = parseInt(a.replace(/[^\d]+/, ''), 10) || 0;
            const regionIdB = parseInt(b.replace(/[^\d]+/, ''), 10) || 0;
            return regionIdA - regionIdB;
          }
          return regionA.localeCompare(regionB);
        });

      const allContinents = {
        id: 'WORLD',
        code: 'WORLD',
        name: tLoc('pci_project_regions_list_continent_all'),
      };

      const continents = [...new Set(regions.map((r) => r.continentLabel))].map(
        (c) => {
          const region = regions.find((r) => r.continentLabel === c);
          return {
            id: region.macro,
            code: region.continentCode,
            name: c,
          };
        },
      );

      return {
        regions,
        continents: [allContinents, ...continents],
      };
    },
  });
};
