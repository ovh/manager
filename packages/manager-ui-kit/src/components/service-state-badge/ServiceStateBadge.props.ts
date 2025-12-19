import { ComponentProps } from 'react';

import { Badge } from '@/components/badge/Badge.component';

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
