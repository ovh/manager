import { LicenseEnum, TaskStatusEnum, UserStateEnum } from '../ApiType';
import { PendingTaskType, UserNativeType } from '../users/type';

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
    licences: [LicenseEnum.OFFICE_PRO_PLUS],
    status: UserStateEnum.OK,
    taskPendingId: 0,
    usageLocation: 'fr',
  },
  {
    activationEmail: 'test2@office529.o365.ovh.com',
    deleteAtExpiration: false,
    firstName: 'test',
    isVirtual: false,
    lastName: 'test',
    licences: [LicenseEnum.OFFICE_PRO_PLUS],
    status: UserStateEnum.OK,
    taskPendingId: 0,
    usageLocation: 'fr',
  },
];

export const pendingTask: PendingTaskType = {
  finishDate: null,
  function: 'deleteOffice365UserPaygNCE',
  id: 581553,
  status: TaskStatusEnum.TODO,
  todoDate: '2025-01-09T11:20:52+01:00',
};

export const userDomainMock = ['test.office.ovh.com'];
