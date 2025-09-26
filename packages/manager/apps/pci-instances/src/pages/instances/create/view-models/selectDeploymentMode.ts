import { TInstancesCatalog } from '@/types/instance/instancesCatalog.type';
import { TDeploymentMode } from '@/types/instance/common.type';
import InstanceImage from '../../../../../public/assets/instance.png';

import { instancesCatalogQueryKey } from '@/adapters/tanstack-query/store/instances/queryKeys';
import { Deps, Reader } from '@/deps/deps';

export type TDeploymentModeDataForCard = {
  mode: TDeploymentMode;
  title: string;
  description: string;
  url: string;
};

const mapDeploymentModeForCard = (
  mode: TDeploymentMode,
): TDeploymentModeDataForCard => ({
  mode,
  title: `pci_instances_common_instance_${mode}_deployment_mode`,
  description: `pci_instances_common_instance_${mode}_deployment_mode_description`,
  url: InstanceImage,
});

type TSelectDeploymentModesForCard = (
  projectId: string,
) => TDeploymentModeDataForCard[];

export const selectDeploymentModes: Reader<
  Deps,
  TSelectDeploymentModesForCard
> = (deps) => (projectId: string): TDeploymentModeDataForCard[] => {
  const { get } = deps.store;
  const data = get<TInstancesCatalog>(instancesCatalogQueryKey(projectId));

  return (
    data?.entities.deploymentModes.allIds.map(mapDeploymentModeForCard) ?? []
  );
};
