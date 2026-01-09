import { TDeploymentMode, TShareCatalog } from '@/domain/entities/catalog.entity';

import Region1azImage from '../../../../public/assets/1AZ.svg';
import Region3azImage from '../../../../public/assets/3AZ.svg';
import LZImage from '../../../../public/assets/LZ.svg';

import { TDeploymentModeDataForCard, TSVGImage } from '@/adapters/catalog/left/data.type';

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

export const selectDeploymentModes = (data?: TShareCatalog): TDeploymentModeDataForCard[] =>
  (data?.entities?.deploymentModes?.allIds ?? []).map(mapDeploymentModeForCard);
