import { ComponentType, SVGProps } from 'react';
import { TDeploymentMode } from '@/types/instance/common.type';
import Region1azImage from '../../../../../public/assets/1AZ.svg';
import Region3azImage from '../../../../../public/assets/3AZ.svg';
import LZImage from '../../../../../public/assets/LZ.svg';

import { Reader } from '@/types/utils.type';
import { Deps } from '@/deps/deps';

type TSVGImage = ComponentType<SVGProps<SVGSVGElement>>;

export type TDeploymentModeDataForCard = {
  mode: TDeploymentMode;
  titleKey: string;
  descriptionKey: string;
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
  mode: TDeploymentMode,
): TDeploymentModeDataForCard => ({
  mode,
  titleKey: `pci_instances_common_instance_${mode}_deployment_mode`,
  descriptionKey: `pci_instances_common_instance_${mode}_deployment_mode_description`,
  Image: (getImage(mode) as unknown) as TSVGImage,
});

type TSelectDeploymentModesForCard = (
  projectId: string,
) => TDeploymentModeDataForCard[];

export const selectDeploymentModes: Reader<
  Deps,
  TSelectDeploymentModesForCard
> = (deps) => (projectId: string): TDeploymentModeDataForCard[] => {
  const { instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  return (
    data?.entities.deploymentModes.allIds.map(mapDeploymentModeForCard) ?? []
  );
};
