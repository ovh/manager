import {Resource, ResourceWithAzName} from "@/types/Resource.type";
import {Tenant} from "@/types/Tenant.type";

export type TenantWithName = Pick<Tenant, "name">
export type TenantWithVault = Pick<Tenant, "vaults">

export const mapTenantToTenantWithAzName =
  <T extends TenantWithVault>(tenant: T): T & Pick<ResourceWithAzName["currentState"], "azName"> =>
  ({...tenant, azName: tenant.vaults[0]?.azName ?? ''});

export const mapTenantResourceToTenantResourceWithAzName =
  <T extends TenantWithVault & TenantWithName>(resourceTenant: Resource<T>): Resource<T> & ResourceWithAzName =>
  ({...resourceTenant, currentState: mapTenantToTenantWithAzName(resourceTenant.currentState)});

