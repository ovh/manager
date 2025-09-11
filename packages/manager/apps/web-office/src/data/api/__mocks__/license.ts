import { LicenseEnum, TaskStatusEnum, UserStateEnum } from '../ApiType';
import { LicensePrepaidType, LicenseType } from '../license/type';
import { PendingTaskType } from '../users/type';

export const licensesMock: LicenseType[] = [
  {
    address: '1234 Main St',
    city: 'Paris',
    creationDate: '2020-01-15T12:00:00+02:00',
    displayName: 'user123.o365.ovh.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '0033123456789',
    serviceName: 'user123.o365.ovh.com',
    serviceType: 'payAsYouGo',
    status: UserStateEnum.OK,
    tenantServiceName: 'user123.o365.ovh.com',
    zipCode: '75001',
    iam: {
      id: '12345abc-6789-def0-gh12-3456789ijklm',
      urn: 'urn:v1:eu:resource:licenseOffice:user123.o365.ovh.com',
    },
  },
  {
    address: '12345 Main St',
    city: 'Lille',
    creationDate: '2020-01-15T12:00:00+02:00',
    displayName: 'user123.o365.ovh.com',
    firstName: 'Test',
    lastName: 'Test',
    phone: '0033123456789',
    serviceName: 'topuser125.o365.ovh.com',
    serviceType: 'payAsYouGo',
    status: UserStateEnum.OK,
    tenantServiceName: 'user123.o365.ovh.com',
    zipCode: '59000',
    iam: {
      id: '12345abc-6789-def0-gh12-3456789ijklm',
      urn: 'urn:v1:eu:resource:licenseOffice:user123.o365.ovh.com',
    },
  },
];

export const licensesPrepaidMock: string[] = [
  'office5678.o365.ovh.com-1234',
  'office1234.o365.ovh.com-5678',
];

export const licensesPrepaidExpandedMock: LicensePrepaidType[] = [
  {
    activationEmail: '1234@office5678.o365.ovh.com',
    firstName: 'configureme',
    isVirtual: true,
    lastName: 'configureme',
    licences: [LicenseEnum.OFFICE_PRO_PLUS],
    serviceName: 'office5678.o365.ovh.com-1234',
    status: UserStateEnum.OK,
    taskPendingId: 0,
    tenantServiceName: 'office5678.o365.ovh.com',
    usageLocation: 'fr',
    iam: {
      id: '96faec97-1257-4ae8-b2f5-49d8bc74bdd2',
      urn: 'urn:v1:eu:resource:licenseOfficePrepaid:office5678.o365.ovh.com-1234',
    },
  },
  {
    activationEmail: '5678@office1234.o365.ovh.com',
    firstName: 'i',
    isVirtual: false,
    lastName: 'i',
    licences: [LicenseEnum.OFFICE_PRO_PLUS],
    serviceName: 'office1234.o365.ovh.com-5678',
    status: UserStateEnum.OK,
    taskPendingId: 0,
    tenantServiceName: 'office1234.o365.ovh.com',
    usageLocation: 'fr',
    iam: {
      id: 'da75876b-cc2a-429d-8942-ef0e26fced73',
      urn: 'urn:v1:eu:resource:licenseOfficePrepaid:office1234.o365.ovh.com-5678',
    },
  },
];

export const tenantPendingTask: PendingTaskType = {
  finishDate: '2025-01-09T12:00:12+01:00',
  function: 'unconfigureOffice365UserNCE',
  id: 581562,
  status: TaskStatusEnum.DONE,
  todoDate: '2025-01-09T12:00:12+01:00',
};
