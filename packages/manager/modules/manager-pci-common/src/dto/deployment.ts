import { ReactNode } from 'react';
import { TRegionType } from '@/api/data';

export type TDeployment = {
  name: TRegionType;
  beta?: boolean;
  comingSoon?: boolean;
  price?: ReactNode;
};
