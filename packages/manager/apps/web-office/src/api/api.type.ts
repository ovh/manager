import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export enum UserStateEnum {
  CREATING = 'creating',
  DELETING = 'deleting',
  OK = 'ok',
  UNCONFIGURED = 'unconfigured',
  SUSPENDED = 'suspended',
  SUSPENDING = 'suspending',
  UNSUSPENDING = 'unsuspending',
}

export enum LicenseEnum {
  OFFICE_BUSINESS = 'officeBusiness',
  OFFICE_PRO_PLUS = 'officeProPlus',
}

export enum TaskStatusEnum {
  CANCELLED = 'cancelled',
  DOING = 'doing',
  DONE = 'done',
  ERROR = 'error',
  TODO = 'todo',
}

export type UserParamsType = {
  activationEmail: string;
  firstName: string;
  lastName: string;
};
export type UserOrderParamsType = {
  domain: string;
  firstName: string;
  lastName: string;
  usageLocation: OvhSubsidiary;
  licence: string;
  login: string;
};

export type UserChangePasswordType = {
  password?: string;
  shouldSendMail: boolean;
  notifyEmail?: string;
};
