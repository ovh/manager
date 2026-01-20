import { IamObject } from '@ovh-ux/muk';

import { LocationPathParams } from '@/routes/Routes.constants';
import { ResourceStatus } from '@/types/resource.type';

export interface ServiceGeneralInformationProps extends LocationPathParams {
  title?: string;
  iam?: IamObject;
  resourceStatus?: ResourceStatus;
  createdAt?: string;
  isLoading: boolean;
}
