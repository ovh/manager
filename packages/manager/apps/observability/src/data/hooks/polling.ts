import { ResourceStatus } from '@/types/resource.type';

export const POLLING_INTERVAL = 5000;
export const POLLING_STATUSES: ResourceStatus[] = ['DELETING', 'UPDATING', 'CREATING'];

export const isPollingStatus = (status: ResourceStatus | undefined): boolean =>
  status !== undefined && POLLING_STATUSES.includes(status);

export const getPollingInterval = (status: ResourceStatus | undefined): number | false =>
  isPollingStatus(status) ? POLLING_INTERVAL : false;
