import { Tenant } from '@/types/tenants.type';

export interface TenantsListDatagridProps {
  tenantsList: Tenant[];
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}
