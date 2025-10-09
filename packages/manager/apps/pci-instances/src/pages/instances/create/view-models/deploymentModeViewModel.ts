import { TDeploymentMode } from '@/types/instance/common.type';
import InstanceImage from '../../../../../public/assets/instance.png';

import { Reader } from '@/types/utils.type';
import { Deps } from '@/deps/deps';
import { MessageProviderPort } from '@/domain/port/messageProvider/left/port';

export type TDeploymentModeDataForCard = {
  mode: TDeploymentMode;
  title: string;
  description: string;
  url: string;
};

const mapDeploymentModeForCard = (getMessageFn: MessageProviderPort["getMessage"]) => (
  mode: TDeploymentMode,
): TDeploymentModeDataForCard => ({
  mode,
  title: getMessageFn(
    `common:pci_instances_common_instance_${mode}_deployment_mode`,
  ),
  description: getMessageFn(
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
  const { messageProviderPort, instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  return (
    data?.entities.deploymentModes.allIds.map(
      mapDeploymentModeForCard(messageProviderPort.getMessage),
    ) ?? []
  );
};
