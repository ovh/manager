import { TDeploymentMode } from '@/types/instance/common.type';
import InstanceImage from '../../../../../public/assets/instance.png';

import { Reader } from '@/types/utils.type';
import { Deps, TTranslateFn } from '@/deps/deps';

export type TDeploymentModeDataForCard = {
  mode: TDeploymentMode;
  title: string;
  description: string;
  url: string;
};

const mapDeploymentModeForCard = (translate: TTranslateFn) => (
  mode: TDeploymentMode,
): TDeploymentModeDataForCard => ({
  mode,
  title: translate(
    `common:pci_instances_common_instance_${mode}_deployment_mode`,
  ),
  description: translate(
    `common:pci_instances_common_instance_${mode}_deployment_mode_description`,
  ),
  url: InstanceImage,
});

type TSelectDeploymentModesForCard = (
  projectId: string,
) => TDeploymentModeDataForCard[];

export const selectDeploymentModes: Reader<
  Deps,
  TSelectDeploymentModesForCard
> = (deps) => (projectId: string): TDeploymentModeDataForCard[] => {
  const { translate, instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  return (
    data?.entities.deploymentModes.allIds.map(
      mapDeploymentModeForCard(translate),
    ) ?? []
  );
};
