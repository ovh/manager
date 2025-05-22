import { OdsBadge } from '@ovhcloud/ods-components/react';
import React, { ComponentProps } from 'react';

export type RegionChipProps = Omit<
  ComponentProps<typeof OdsBadge>,
  'label' | 'children'
> & {
  className?: string;
  children?: string;
};

export function RegionChip({ children, ...chipProps }: RegionChipProps) {
  return <OdsBadge label={children} {...chipProps} />;
}
