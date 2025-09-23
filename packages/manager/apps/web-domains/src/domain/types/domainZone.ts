import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';

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
