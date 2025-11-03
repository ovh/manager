import { ResourceStatus, ResourceWithAzName } from '@/types/Resource.type';

import { Vault } from './Vault.type';

type AssociatedTenantVSPC = {
  azName: string;
  id: string;
  name: string;
  status: ResourceStatus;
};

export type Tenant = {
  id: string;
  name: string;
  vaults: Omit<Vault, 'vspc'>[];
  vspcTenants: AssociatedTenantVSPC[];
};

export type TenantWithAzName = Tenant & Pick<ResourceWithAzName['currentState'], 'azName'>;
