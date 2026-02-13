import { Deps } from '@/deps/deps';
import { TDeploymentMode } from '@/types/instance/common.type';
import { Reader } from '@/types/utils.type';

export type TContinentData = { labelKey: string; value: string };

type TSelectContinentData = (
  projectId: string,
  deploymentModes: TDeploymentMode[],
) => TContinentData[];

export const selectContinent: Reader<Deps, TSelectContinentData> = (
  deps: Deps,
) => (
  projectId: string,
  deploymentModes: TDeploymentMode[],
): TContinentData[] => {
  const { instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return [];

  const continentsIds = !deploymentModes.length
    ? ['all', ...data.entities.continents.allIds]
    : [
        'all',
        ...new Set(
          deploymentModes.flatMap(
            (mode) =>
              data.relations.continentIdsByDeploymentModeId.get(mode) ?? [],
          ),
        ),
      ];

  return continentsIds.map((continent) => ({
    labelKey: `pci_instances_common_instance_continent_${continent}`,
    value: continent,
  }));
};
