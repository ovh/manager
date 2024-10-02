import { useQuery } from '@tanstack/react-query';
import {
  getZoneFromMacro,
  getMacroRegion,
} from '@ovh-ux/manager-react-components';
import { getProjectRegions, TRegion } from '../../api/data/regions';

export type TLocalisation = TRegion & {
  isMacro: boolean; // is a macro region ?
  isLocalZone: boolean; // is a localzone ?
  macro: string; // associated macro region code
};

export const useProjectRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'region'],
    queryFn: () => getProjectRegions(projectId),
    select: (data): TLocalisation[] =>
      data
        .map((region) => {
          const macro = getMacroRegion(region.name);
          return {
            ...region,
            isMacro: region.name === macro,
            macro,
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
        }),
  });
