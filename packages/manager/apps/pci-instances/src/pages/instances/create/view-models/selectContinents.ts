import { Deps } from '@/deps/deps';
import { TDeploymentMode } from '@/types/instance/common.type';
import { Reader } from '@/types/utils.type';

export type TContinentData = { label: string; value: string };

type TSelectContinentData = (
  projectId: string,
  deploymentModes: TDeploymentMode[],
) => TContinentData[];

export const selectContinentData: Reader<Deps, TSelectContinentData> = (
  deps: Deps,
) => (
  projectId: string,
  deploymentModes: TDeploymentMode[],
): TContinentData[] => {
  const { translate, instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return [];

  const continents = [
    ...new Set(
      deploymentModes.flatMap(
        (mode) => data.relations.continentIdsByDeploymentModeId.get(mode) ?? [],
      ),
    ),
  ];

  return continents.map((continent) => ({
    label: translate(`pci_instances_common_instance_continent_${continent}`),
    value: continent,
  }));
};
