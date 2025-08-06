import { CurrencyCode } from '@ovh-ux/manager-react-components';
import { Status } from '@/types/ssl';

export enum ResourceStatus {
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  READY = 'READY',
  UPDATING = 'UPDATING',
  SUSPENDED = 'SUSPENDED',
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
      vcsBranch?: string;
      vcsUrl?: string;
    };
    ssl?: {
      status: ServiceStatus;
    };
    hosting?: {
      serviceName?: string;
      displayName?: string;
      offer?: string;
      boostOffer?: string;
    };
    ownLog?: string;
  };
  currentTasks?: {
    id?: string;
    link?: string;
    status?: TaskStatus;
    type?: TaskType;
  }[];
};
export type ManagedWordpressResourceType = {
  id: string;
  resourceStatus: ResourceStatus;
  checksum: string;
  iam: {
    displayName: string;
    id: string;
    tags: Record<string, unknown>;
    urn: string;
  };
  currentState: {
    plan: string;
    quotas: {
      websites: {
        planQuota: number;
        additionalQuota: number;
        totalQuota: number;
        totalUsage: number;
      };
      disk: {
        planQuotaBytes: number;
        additionalQuotaBytes: number;
        totalQuotaBytes: number;
        totalUsageBytes: number;
      };
      visits: {
        totalAdditionalQuota: number;
        boosts: {
          initialAmount: number;
          currentAmount: number;
          createdAt: string;
          expiresAt: string;
        }[];
      };
    };
    dashboards: {
      wordPress: string;
    };
    createdAt: string;
  };
  currentTasks: {
    id: string;
    link: string;
    plan: string;
    status: TaskStatus | string;
    type: string;
  }[];
};
export enum ManagedWordpressCmsType {
  WORD_PRESS = 'WORD_PRESS',
}
export type ManagedWordpressResourceDetailsType = {
  id: string;
  resourceStatus: ResourceStatus;
  checksum: string;
  iam: {
    displayName?: string;
    id: string;
    tags: Record<string, unknown>;
    urn: string;
  } | null;
  currentState: {
    plan: string;
    createdAt: string;
    dashboards: {
      wordPress?: string;
    };
    quotas: {
      disk: {
        additionalQuotaBytes: number;
        planQuotaBytes: number;
        totalQuotaBytes: number;
        totalUsageBytes: number;
      };
      visits: {
        totalAdditionalQuota: number;
        boosts: {
          createdAt: string;
          currentAmount: number;
          expiresAt: string;
          initialAmount: number;
        }[];
      };
      websites: {
        additionalQuota: number;
        planQuota: number;
        totalQuota: number;
        totalUsage: number;
      };
    };
  };
  currentTasks: {
    id: string;
    link: string;
    status: Status;
    type: string;
  }[];
};

export type PostImportPayload = {
  adminLogin: string;
  adminPassword: string;
  adminURL?: string;
  cms: 'WORD_PRESS';
  cmsSpecific?: {
    wordPress?: {
      language?: string;
      url?: string;
    };
  };
};
export type PostImportTaskPayload = {
  'import.cmsSpecific.wordPress.selection': {
    plugins: { name: string; version: string; enabled: boolean }[];
    themes: { name: string; version: string; active: boolean }[];
    wholeDatabase: boolean;
    media: boolean;
    posts: boolean;
    pages: boolean;
    comments: boolean;
    tags: boolean;
    users: boolean;
  };
};

export type ManagedWordpressWebsiteDetails = {
  id: string;
  checksum: string;
  currentState: {
    cms: ManagedWordpressCmsType;
    createdAt: string;
    defaultFQDN: string;
    diskUsageBytes: number;
    import: {
      checkResult: {
        cmsSpecific: {
          wordPress: {
            plugins: {
              enabled: boolean;
              name: string;
              version: string;
            }[];
            themes: {
              active: boolean;
              name: string;
              version: string;
            }[];
          };
        };
      };
    };
    phpVersion: string;
    serviceId: string;
  };
  currentTasks: {
    id: string;
    link: string;
    status: Status;
    type: string;
  }[];
  resourceStatus: ResourceStatus;
  targetSpec?: {
    creation?: {
      adminLogin: string;
      cms: ManagedWordpressCmsType;
      adminPassword?: string;
      cmsSpecific?: {
        wordPress?: {
          language?: string;
          url?: string;
        };
      };
      phpVersion?: string;
    };
    import?: {
      adminLogin: string;
      adminPassword?: string;
      adminURL: string;
      cms: ManagedWordpressCmsType;
      cmsSpecific?: {
        wordPress?: {
          selection?: {
            comments?: boolean;
            media?: boolean;
            pages?: boolean;
            plugins?: {
              enabled: boolean;
              name: string;
              version: string;
            }[];
            posts?: boolean;
            tags?: boolean;
            themes?: {
              active: boolean;
              name: string;
              version: string;
            }[];
            users?: boolean;
            wholeDatabase: boolean;
          };
        };
      };
    };
  };
};
export type ManagedWordpressWebsites = {
  id: string;
  checksum: string;
  currentState: {
    cms?: ManagedWordpressCmsType;
    createdAt: string;
    defaultFQDN?: string;
    diskUsageBytes: number;
    import: {
      checkResult: {
        cmsSpecific: {
          wordPress: {
            plugins: {
              enabled: boolean;
              name: string;
              version: string;
            }[];
            themes: {
              active: boolean;
              name: string;
              version: string;
            }[];
          };
        };
      };
    };
    phpVersion: string;
    id: string;
  };
  currentTasks: {
    id: string;
    link: string;
    status: TaskStatus;
    type: string;
  }[];
  iam: {
    displayName?: string;
    id: string;
    tags?: Record<string, string>;
    urn: string;
  };
  resourceStatus: ResourceStatus;
  targetSpec?: {
    creation?: {
      adminLogin: string;
      cms: ManagedWordpressCmsType;
      adminPassword?: string;
      cmsSpecific?: {
        wordPress?: {
          language?: string;
          url?: string;
        };
      };
      phpVersion?: string;
    };
    import?: {
      adminLogin: string;
      adminPassword?: string;
      adminURL: string;
      cms: ManagedWordpressCmsType;
      cmsSpecific?: {
        wordPress?: {
          selection?: {
            comments?: boolean;
            media?: boolean;
            pages?: boolean;
            plugins?: {
              enabled: boolean;
              name: string;
              version: string;
            }[];
            posts?: boolean;
            tags?: boolean;
            themes?: {
              active: boolean;
              name: string;
              version: string;
            }[];
            users?: boolean;
            wholeDatabase: boolean;
          };
        };
      };
    };
  };
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

export enum HostingDomainStatus {
  ACTIVE = 'active',
  NONE = 'none',
}

export enum PhpVersionsSupport {
  BETA = 'BETA',
  END_OF_LIFE = 'END_OF_LIFE',
  SECURITY_FIXES = 'SECURITY_FIXES',
  SUPPORTED = 'SUPPORTED',
}

export enum DomainStatus {
  cancelled = 'cancelled',
  doing = 'doing',
  done = 'done',
  init = 'init',
  todo = 'todo',
}

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
