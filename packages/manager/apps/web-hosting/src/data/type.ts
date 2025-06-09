import { CurrencyCode } from '@ovh-ux/manager-react-components';

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

export enum HostingState {
  ACTIVE = 'active',
  BLOQUED = 'bloqued',
  MAINTENANCE = 'maintenance',
}

export enum HostingRessourceType {
  BEST_EFFORT = 'bestEffort',
  CLOUD = 'cloud',
  DEDICATED = 'dedicated',
  SHARED = 'shared',
}

export enum HostingdOffer {
  CLOUDWEB_1 = 'CLOUDWEB_1',
  CLOUDWEB_2 = 'CLOUDWEB_2',
  CLOUDWEB_3 = 'CLOUDWEB_3',
  KS = 'KS',
  PERFORMANCE_1 = 'PERFORMANCE_1',
  PERFORMANCE_2 = 'PERFORMANCE_2',
  PERFORMANCE_3 = 'PERFORMANCE_3',
  PERFORMANCE_4 = 'PERFORMANCE_4',
  PERSO = 'PERSO',
  POWER_BETA_1 = 'POWER_BETA_1',
  PRO = 'PRO',
  START = 'START',
}

export enum HostingCountries {
  BE = 'BE',
  CA = 'CA',
  CZ = 'CZ',
  DE = 'DE',
  ES = 'ES',
  FI = 'FI',
  FR = 'FR',
  IE = 'IE',
  IT = 'IT',
  LT = 'LT',
  NL = 'NL',
  PL = 'PL',
  PT = 'PT',
  UK = 'UK',
}

export enum PhpVersionsSupport {
  BETA = 'BETA',
  END_OF_LIFE = 'END_OF_LIFE',
  SECURITY_FIXES = 'SECURITY_FIXES',
  SUPPORTED = 'SUPPORTED',
}

export type WebHostingType = {
  availableBoostOffer: {
    offer: HostingdOffer;
    price: {
      currencyCode: CurrencyCode;
      priceInUcents?: number;
      text: string;
      value: number;
    };
  }[];
  boostOffer?: string;
  cluster: string;
  clusterIp?: string;
  clusterIpv6?: string;
  countriesIp: {
    country: HostingCountries;
    ip?: string;
    ipv6?: string;
  }[];
  datacenter: string;
  defaultAttachedDomain?: string;
  displayName?: string;
  filer?: string;
  hasCdn?: boolean;
  hasHostedSsl?: boolean;
  home: string;
  hostingIp?: string;
  hostingIpv6?: string;
  iam?: {
    displayName?: string;
    id: string;
    tags?: {
      'any-key': string;
    };
    urn: string;
  };
  lastOvhConfigScan?: string;
  multipleSSL: boolean;
  offer: string;
  operatingSystem: string;
  phpVersions: {
    support: PhpVersionsSupport;
    version: string;
  }[];
  primaryLogin: string;
  quotaSize: {
    unit: string;
    value: number;
  };
  quotaUsed: {
    unit: string;
    value: number;
  };
  recommendedOffer: HostingdOffer;
  resourceType: HostingRessourceType;
  serviceManagementAccess: {
    ftp: {
      port: number;
      url: string;
    };
    http: {
      port: number;
      url: string;
    };
    ssh: {
      port: number;
      url: string;
    };
  };
  serviceName: string;
  state: HostingState;
  token?: string;
  trafficQuotaSize?: {
    unit: string;
    value: number;
  };
  trafficQuotaUsed?: {
    unit: string;
    value: number;
  };
  updates: string[];
};

export type ServiceInfosType = {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo: string;
  expiration: string;
  possibleRenewPeriod: [0];
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean;
    period: number;
  };
  renewalType: string;
  serviceId: number;
  status: string;
};

export enum DnssecState {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
  NOT_SUPPORTED = 'not_supported',
}

export enum NameServerType {
  ANYCAST = 'anycast',
  DEDICATED = 'dedicated',
  EMPTY = 'empty',
  EXTERNAL = 'external',
  HOLD = 'hold',
  HOSTED = 'hosted',
  HOSTING = 'hosting',
  MIXED = 'mixed',
  PARKING = 'parking',
}

export enum DomainOffer {
  DIAMOND = 'diamond',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum DomainState {
  EXPIRED = 'expired',
  RESTORABLE = 'restorable',
  DELETED = 'deleted',
  PENDING_DELETE = 'pending_delete',
  OUTGOING_TRANSFER = 'outgoing_transfer',
  DISPUTE = 'dispute',
  OK = 'ok',
}

export enum SuspensionState {
  NOT_SUSPENDED = 'not_suspended',
  SUSPENDED = 'suspended',
}

export enum TransferLockStatus {
  LOCKED = 'locked',
  LOCKING = 'locking',
  UNAVAILABLE = 'unavailable',
  UNLOCKED = 'unlocked',
  UNLOCKING = 'unlocking',
}

export type DomainServiceType = {
  contactAdmin: {
    id: string;
  };
  contactBilling: {
    id: string;
  };
  contactOwner: {
    id: string;
  };
  contactTech: {
    id: string;
  };
  dnssecState: DnssecState;
  dnssecSupported: boolean;
  domain: string;
  expirationDate: string;
  glueRecordIpv6Supported: boolean;
  glueRecordMultiIpSupported: boolean;
  hostSupported: boolean;
  iam: {
    displayName: string;
    id: string;
    tags: {
      'any-key': string;
    };
    urn: string;
  };
  lastUpdate: string;
  nameServerType: NameServerType;
  nameServers: [
    {
      id: number;
      ipv4: string;
      ipv6: string;
      nameServer: string;
      nameServerType: NameServerType;
    },
  ];
  offer: DomainOffer;
  owoSupported: boolean;
  parentService: {
    name: string;
    type: '/allDom';
  };
  renewalDate: string;
  renewalState: string;
  serviceId: number;
  state: DomainState;
  suspensionState: SuspensionState;
  transferLockStatus: TransferLockStatus;
  whoisOwner: string;
};

export type EmailOptionType = {
  id: number;
  domain: string;
  creationDate: string;
};
