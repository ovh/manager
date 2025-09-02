import { DomainStatus } from '../status';
import { HostingCountries, HostingDomainStatus } from './webHosting';

export type TAttachedDomain = {
  doneDate?: string;
  function: string;
  id?: number;
  lastUpdate?: string;
  objectId?: string;
  objectType?: string;
  startDate: string;
  status: DomainStatus;
};

export type TCreateAttachedDomain = {
  serviceName?: string;
  domain?: string;
  cdn?: HostingDomainStatus;
  firewall?: HostingDomainStatus;
  ownLog?: string;
  path?: string;
  runtimeId?: number;
  ssl?: boolean;
  bypassDNSConfiguration?: boolean;
  ipLocation?: HostingCountries;
  wwwNeeded?: boolean;
};

export type TExistingDomain = {
  domain?: string;
  existingDomains?: string[];
  list?: string;
  listwww?: string[];
  state?: string;
  subdomain?: string;
  token?: string;
  tokenSubdomain?: string;
};
