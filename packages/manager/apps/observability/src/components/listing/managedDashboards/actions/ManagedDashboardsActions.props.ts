import { LocationPathParams } from '@/routes/Routes.constants';

export type ManagedDashboardsActionsProps<T> = LocationPathParams & {
  managedDashboard: T;
};
