import { FC, PropsWithChildren } from 'react';
import './distributionImageLabel.scss';
import {
  TDistributionImageName,
  DISTRIBUTION_IMAGE_NAME,
} from '@/types/instance/common.type';

const isDistributionName = (name: string): name is TDistributionImageName =>
  DISTRIBUTION_IMAGE_NAME.includes(name as TDistributionImageName);

export const DistributionImageLabel: FC<PropsWithChildren<{
  name?: string;
}>> = ({ name, children }) => (
  <div className="flex items-center pr-8">
    {name && isDistributionName(name) && (
      <span className={`distributionImage distributionImage--${name}`} />
    )}
    {children}
  </div>
);
