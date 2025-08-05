import { ComponentProps } from 'react';
import { Badge } from '../badge';

export type ResourceStatus =
  | 'active'
  | 'deleted'
  | 'suspended'
  | 'toActivate'
  | 'toDelete'
  | 'toSuspend';

export type ServiceStateBadgeProps = Omit<
  ComponentProps<typeof Badge>,
  'color' | 'label'
> & {
  state: ResourceStatus;
};
