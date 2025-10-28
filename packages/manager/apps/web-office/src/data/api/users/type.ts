import { LicenseEnum, TaskStatusEnum, UserStateEnum } from '../ApiType';

export type UserNativeType = {
  activationEmail: string;
  deleteAtExpiration: boolean;
  firstName: string;
  isVirtual: boolean;
  lastName: string;
  licences: LicenseEnum[];
  status: UserStateEnum;
  taskPendingId: number;
  usageLocation: string;
  serviceName?: string;
  [key: string]: string | number | boolean | LicenseEnum[] | { id: string; urn: string };
};

export type PendingTaskType = {
  finishDate?: string;
  function: string;
  id: number;
  status: TaskStatusEnum;
  todoDate: string;
};
