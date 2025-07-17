import { ComponentProps } from 'react';
import { ResourceStatus } from '../../hooks/services/services.type';
import { Badge } from '../badge';

export type ServiceStateBadgeProps = Omit<
  ComponentProps<typeof Badge>,
  'color' | 'label'
> & {
  state: ResourceStatus;
};
