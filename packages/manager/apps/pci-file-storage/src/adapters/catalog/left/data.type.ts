import { TDeploymentMode } from '@/domain/entities/catalog.entity';
import { ComponentType, SVGProps } from 'react';

export type TSVGImage = ComponentType<SVGProps<SVGSVGElement>>;

export type TDeploymentModeDataForCard = {
  mode: TDeploymentMode;
  titleKey: string;
  descriptionKey: string;
  Image: TSVGImage;
};
