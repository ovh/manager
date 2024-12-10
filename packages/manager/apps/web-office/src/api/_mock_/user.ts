import { LicenseEnum, UserStateEnum } from '../api.type';
import { UserNativeType } from '../users/type';

export const usersMock: UserNativeType[] = [
  {
    activationEmail: 'first.name@office529.o365.ovh.com',
    deleteAtExpiration: false,
    firstName: 'First',
    isVirtual: false,
    lastName: 'Name',
    licences: [LicenseEnum.OFFICE_BUSINESS],
    status: UserStateEnum.OK,
    taskPendingId: 0,
    usageLocation: 'fr',
  },
  {
    activationEmail: 'test@office529.o365.ovh.com',
    deleteAtExpiration: false,
    firstName: 'test',
    isVirtual: false,
    lastName: 'test',
    licences: [LicenseEnum.OFFICE_BUSINESS],
    status: UserStateEnum.OK,
    taskPendingId: 0,
    usageLocation: 'fr',
  },
];
