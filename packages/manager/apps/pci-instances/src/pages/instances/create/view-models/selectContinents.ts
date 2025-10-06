import { Deps } from '@/deps/deps';
import { TDeploymentMode } from '@/types/instance/common.type';
import { Reader } from '@/types/utils.type';

export type TContinentData = { label: string; value: string };

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
  const { messageProviderPort, instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return [];

  const continentsIds = !deploymentModes.length
    ? data.entities.continents.allIds
    : [
        ...new Set(
          deploymentModes.flatMap(
            (mode) =>
              data.relations.continentIdsByDeploymentModeId.get(mode) ?? [],
          ),
        ),
      ];

  return ['all', ...continentsIds].map((continent) => ({
    label: messageProviderPort.getMessage(
      `common:pci_instances_common_instance_continent_${continent}`,
    ),
    value: continent,
  }));
};
