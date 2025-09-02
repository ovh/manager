import { CurrencyCode } from '@ovh-ux/manager-react-components';

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
