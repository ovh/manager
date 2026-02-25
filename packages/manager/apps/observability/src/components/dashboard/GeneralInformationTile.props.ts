import { IamObject } from '@ovh-ux/muk';

import { LocationPathParams } from '@/routes/Routes.constants';
import { ResourceStatus } from '@/types/resource.type';

export interface GeneralInformationTileProps extends LocationPathParams {
  title?: string;
  description?: string;
  iam?: IamObject;
  endpoint?: string;
  resourceStatus?: ResourceStatus;
  createdAt?: string;
  updatedAt?: string | null;
  isLoading: boolean;
}
