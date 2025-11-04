import { ComponentProps } from 'react';

import { Badge } from '@/components';

export type ResourceStatus =
  | 'active'
  | 'deleted'
  | 'suspended'
  | 'toActivate'
  | 'toDelete'
  | 'toSuspend';

export type ServiceStateBadgeProps = Omit<ComponentProps<typeof Badge>, 'color' | 'label'> & {
  state: ResourceStatus;
};
