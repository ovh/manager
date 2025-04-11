import { IamObject } from '@ovh-ux/manager-react-components';
import { IpTypeEnum } from '@/data/api';

export type IpObject = {
  ip: string;
  iam: IamObject;
  rir: 'ARIN' | 'RIPE';
  type: IpTypeEnum;
  campus: string | null;
  country: string;
  regions: [string];
  version: 4 | 6;
  routedTo: {
    serviceName: string;
  };
  description: string | null;
  bringYourOwnIp: boolean;
  isAdditionalIp: boolean;
  organisationId: string | null;
  canBeTerminated: boolean;
};
