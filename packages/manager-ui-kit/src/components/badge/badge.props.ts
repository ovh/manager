import { PropsWithChildren } from 'react';
import { type BadgeProp } from '@ovhcloud/ods-react';

export type BadgeProps = BadgeProp & {
  isLoading?: boolean;
  'data-testid'?: string;
};
