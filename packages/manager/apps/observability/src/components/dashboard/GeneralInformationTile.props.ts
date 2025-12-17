import { IamObject } from '@ovh-ux/muk';

import { TenantResourceStatus } from '@/types/tenants.type';

export interface GeneralInformationTileProps {
  tenantId: string;
  title?: string;
  description?: string;
  iam?: IamObject;
  endpoint?: string;
  resourceStatus?: TenantResourceStatus;
  createdAt?: string;
  updatedAt?: string | null;
  isLoading: boolean;
}
