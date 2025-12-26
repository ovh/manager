import { IamObject } from '@ovh-ux/manager-react-components';

export type Baremetal = {
  ip: string;
  os: string;
  iam: IamObject;
  name: string;
  rack: string;
  state: string;
  bootId: number;
  region: string;
  reverse: string;
  serverId: number;
  linkSpeed: number;
  bootScript: string | null;
  datacenter: string;
  monitoring: boolean;
  powerState: string;
  rescueMail: string | null;
  rootDevice: string | null;
  rescueSshKey: string;
  supportLevel: string;
  noIntervention: boolean;
  commercialRange: string;
  professionalUse: boolean;
  availabilityZone: string;
  newUpgradeSystem: boolean;
  efiBootloaderPath: string;
};
