import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { WithRegion } from '@/types/Utils.type';

export type TenantWithName = Pick<Tenant, 'name'>;
export type TenantWithVault = Pick<Tenant, 'vaults'>;

export const mapTenantToTenantWithRegion = <T extends TenantWithVault>(
  tenant: T,
): WithRegion<T> => ({ ...tenant, region: tenant.vaults[0]?.region ?? '' });

export const mapTenantResourceToTenantResourceWithRegion = <
  T extends TenantWithVault & TenantWithName,
>(
  resourceTenant: Resource<T>,
): Resource<WithRegion<T>> => ({
  ...resourceTenant,
  currentState: mapTenantToTenantWithRegion(resourceTenant.currentState),
});
