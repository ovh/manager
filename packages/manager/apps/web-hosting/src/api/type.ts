export enum ResourceStatus {
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  READY = 'READY',
  UPDATING = 'UPDATING',
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  NONE = 'NONE',
}

export enum GitStatus {
  CREATED = 'CREATED',
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  DEPLOYING = 'DEPLOYING',
  DISABLED = 'DISABLED',
  ERROR = 'ERROR',
  INITIALERROR = 'INITIAL_ERROR',
}

export enum TaskStatus {
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SCHEDULED = 'SCHEDULED',
}

export enum TaskType {
  DEPLOYMENT = 'DEPLOYMENT',
  SSL_SETUP = 'SSL_SETUP',
}

export enum DnsStatus {
  CONFIGURED = 'DNS_CONFIGURED',
  EXTERNAL = 'DNS_EXTERNAL',
  NOT_CONFIGURED = 'DNS_NOT_CONFIGURED',
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
