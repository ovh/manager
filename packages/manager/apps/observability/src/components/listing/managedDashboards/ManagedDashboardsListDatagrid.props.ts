import { Grafana } from '@/types/managedDashboards.type';

export interface ManagedDashboardsListDatagridProps {
  managedDashboardsList: Grafana[];
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}
