import { LicenseEnum, UserStateEnum } from '../api.type';

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
  [key: string]:
    | string
    | number
    | boolean
    | LicenseEnum[]
    | { id: string; urn: string };
};
