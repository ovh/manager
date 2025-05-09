import { UserStateEnum } from '../api.type';

export type ParentTenantType = {
  address: string;
  city: string;
  creationDate: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  serviceName: string;
  serviceType: string;
  status: UserStateEnum;
  zipCode: string;
};
