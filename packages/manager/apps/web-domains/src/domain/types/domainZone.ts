export interface TDomainZone {
  dnssecSupported: boolean;
  hasDnsAnycast: boolean;
  lastUpdate: string;
  name: string;
  nameServers: string[];
}
