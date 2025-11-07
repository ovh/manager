import { GitStatus, ResourceStatus, ServiceStatus, TaskStatus } from '../status';
import { CmsType } from './managedWordpress/cms';

export enum TaskType {
  DEPLOYMENT = 'DEPLOYMENT',
  SSL_SETUP = 'SSL_SETUP',
}

export type WebSiteAttachedDomainDigStatusType = {
  domain: string;
  records: {
    [ip: string]: {
      type: 'A' | 'AAAA';
      dnsConfigured: boolean;
      isOvhIp: boolean;
    };
  };
  recommendedIps: {
    recommendedIpV4: string[];
    recommendedIpV6: string[];
  };
};
export type WebsiteType = {
  id: string;
  checksum?: string;
  currentState?: {
    isDefault?: boolean;
    resourceStatus: ResourceStatus;
    fqdn?: string;
    path?: string;
    cdn?: {
      status?: ServiceStatus;
    };
    firewall?: {
      status?: ServiceStatus;
    };
    git?: {
      status?: GitStatus;
      vcsBranch?: string | null;
      vcsUrl?: string | null;
    };
    ssl?: {
      status: ServiceStatus;
    };
    hosting?: {
      serviceName?: string;
      displayName?: string;
      offer?: string;
      boostOffer?: string | null;
    };
    ownLog?: string | null;
  };
  currentTasks?: {
    id?: string;
    link?: string;
    status?: TaskStatus | null;
    type?: TaskType;
  }[];
};

export enum AssociationType {
  EXISTING = 'EXISTING',
  EXTERNAL = 'EXTERNAL',
  ORDER = 'ORDER',
}

export type WebHostingWebsiteType = {
  associationType: AssociationType;
  cdn: boolean;
  firewall: boolean;
  name: string;
  path: string;
  autoConfigureDns: boolean;
  fqdn: string;
  ip: boolean;
  selectedIp: string;
  module: CmsType;
  advancedConfiguration: boolean;
  wwwNeeded: boolean;
};
