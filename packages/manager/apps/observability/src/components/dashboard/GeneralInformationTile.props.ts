import { IamObject } from '@ovh-ux/muk';

export interface GeneralInformationTileProps {
  tenantId: string;
  title?: string;
  description?: string;
  iam?: IamObject;
  endpoint?: string;
  createdAt?: string;
  updatedAt?: string | null;
  isLoading: boolean;
}
