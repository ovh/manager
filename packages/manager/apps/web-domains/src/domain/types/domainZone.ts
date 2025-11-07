import { DnssecStatusEnum } from '../enum/dnnecStatus.enum';

export interface TDomainZone {
  dnssecSupported: boolean;
  hasDnsAnycast: boolean;
  lastUpdate: string;
  name: string;
  nameServers: string[];
}

export interface DnssecStatus {
  status: DnssecStatusEnum;
}
