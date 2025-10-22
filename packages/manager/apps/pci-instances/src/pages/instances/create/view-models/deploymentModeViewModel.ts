import { ComponentType, SVGProps } from 'react';
import { TDeploymentMode } from '@/types/instance/common.type';
import Region1azImage from '../../../../../public/assets/1AZ.svg';
import Region3azImage from '../../../../../public/assets/3AZ.svg';
import LZImage from '../../../../../public/assets/LZ.svg';

import { Reader } from '@/types/utils.type';
import { Deps } from '@/deps/deps';
import { MessageProviderPort } from '@/domain/port/messageProvider/left/port';

type TSVGImage = ComponentType<SVGProps<SVGSVGElement>>;

export type TDeploymentModeDataForCard = {
  mode: TDeploymentMode;
  title: string;
  description: string;
  Image: TSVGImage;
};

const getImage = (mode: TDeploymentMode) => {
  switch (mode) {
    case 'region-3-az':
      return Region3azImage;
    case 'region':
      return Region1azImage;
    default:
      return LZImage;
  }
};

const mapDeploymentModeForCard = (
  getMessageFn: MessageProviderPort['getMessage'],
) => (mode: TDeploymentMode): TDeploymentModeDataForCard => ({
  mode,
  title: getMessageFn(
    `common:pci_instances_common_instance_${mode}_deployment_mode`,
  ),
  description: getMessageFn(
    `common:pci_instances_common_instance_${mode}_deployment_mode_description`,
  ),
  Image: (getImage(mode) as unknown) as TSVGImage,
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
