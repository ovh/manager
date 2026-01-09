import { TenantResourceStatus } from '@/types/tenants.type';

export const POLLING_INTERVAL = 5000;
export const POLLING_STATUSES: TenantResourceStatus[] = ['DELETING', 'UPDATING', 'CREATING'];

export const isPollingStatus = (status: TenantResourceStatus | undefined): boolean =>
  status !== undefined && POLLING_STATUSES.includes(status);

export const getPollingInterval = (status: TenantResourceStatus | undefined): number | false =>
  isPollingStatus(status) ? POLLING_INTERVAL : false;
