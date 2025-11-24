import { IamObject } from '@ovh-ux/muk';

export interface GeneralInformationTileProps {
  title?: string;
  description?: string;
  iam?: IamObject;
  endpoint?: string;
  createdAt?: string;
  updatedAt?: string | null;
  isLoading: boolean;
}
