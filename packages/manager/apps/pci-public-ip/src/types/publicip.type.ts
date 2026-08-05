import { TBasicIpResourceStatus } from '@/api/data/basic-ip';

export type TBasicIpRow = {
  id: string;
  ip: string;
  region: string;
  associatedResourceId: string;
  status: TBasicIpResourceStatus;
  search: string;
};

export enum PublicIp {
  FAILOVER = 'failover_ip',
  FLOATING = 'floating_ip',
  BASIC = 'basic_ip',
}
