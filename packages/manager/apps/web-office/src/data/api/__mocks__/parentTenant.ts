import { UserStateEnum } from '../ApiType';
import { ParentTenantType } from '../parent-tenant/type';

export const parentTenantMock: ParentTenantType = {
  address: '123 Main Street',
  city: 'Springfield',
  creationDate: '2023-05-15',
  displayName: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  serviceName: 'office5678.o365.ovh.com-1234',
  serviceType: 'prepaid',
  status: UserStateEnum.OK,
  zipCode: '12345',
};
