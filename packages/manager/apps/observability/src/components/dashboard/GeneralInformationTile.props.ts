import { IamObject } from '@ovh-ux/muk';

import { LocationPathParams } from '@/routes/Routes.constants';
import { TenantResourceStatus } from '@/types/tenants.type';

export interface GeneralInformationTileProps extends LocationPathParams {
  title?: string;
  description?: string;
  iam?: IamObject;
  endpoint?: string;
  resourceStatus?: TenantResourceStatus;
  createdAt?: string;
  updatedAt?: string | null;
  isLoading: boolean;
}
