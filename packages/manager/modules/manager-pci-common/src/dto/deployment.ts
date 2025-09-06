import { ReactNode } from 'react';
import { TRegionType } from '@/api/data';
import { TPrice } from '@/dto/price';

export type TDeployment = {
  name: TRegionType;
  beta?: boolean;
  comingSoon?: boolean;
} & (
  | { price?: TPrice }
  | {
      /* @Deprecated use object format instead */
      price?: ReactNode;
    }
);
