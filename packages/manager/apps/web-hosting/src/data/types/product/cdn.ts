export enum CdnStatus {
  CREATED = 'created',
  CREATING = 'creating',
  DELETING = 'deleting',
  FLUSHING = 'flushing',
  REOPENING = 'reopening',
  SUSPENDED = 'suspended',
  SUSPENDING = 'suspending',
}

export const CDN_TYPE = {
  BASIC: 'cdn-basic',
  SECURITY: 'cdn-security',
  ADVANCED: 'cdn-advanced',
};

export const CDN_VERSION = {
  CDN_HOSTING: 'cdn-hosting',
  CDN_V1: 'cdn-v1',
};

export const PURGE_TYPE_ENUM = {
  ALL: 'ALL',
  FOLDER: 'FOLDER',
  URI: 'URI',
  EXTENSION: 'EXTENSION',
  REGEX: 'REGEX',
};
export enum CdnOptionCategory {
  CACHE = 'cache',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
}
interface CdnConfigBase {
  length?: number;
  maximum?: number;
  message?: string;
  minimum?: number;
  type?: CDN_VALUE_TYPE;
}
export enum CDN_DOMAIN_STATUS {
  DELETING = 'deleting',
  DISABLED = 'disabled',
  DISABLING = 'disabling',
  OK = 'ok',
  REFRESHING = 'refreshing',
  TO_DELETE = 'to_delete',
  TO_DISABLE = 'to_disable',
  TO_REFRESH = 'to_refresh',
}
export enum CDN_VALUE_TYPE {
  BOOL = 'bool',
  INT = 'int',
  LIST = 'list',
  STR = 'str',
}

export enum CdnPatternType {
  EXTENSION = 'extension',
  FOLDER = 'folder',
  REGEX = 'regex',
  URI = 'uri',
}

export enum CdnQueryParameterAction {
  IGNORED = 'ignored',
  SORTED = 'sorted',
}

export enum CdnOptionType {
  BROTLI = 'brotli',
  CACHE_RULE = 'cache_rule',
  CORS = 'cors',
  DEVMODE = 'devmode',
  GEO_HEADERS = 'geo_headers',
  HSTS = 'hsts',
  HTTPS_REDIRECT = 'https_redirect',
  MIXED_CONTENT = 'mixed_content',
  MOBILE_REDIRECT = 'mobile_redirect',
  PREFETCH = 'prefetch',
  PREWARM = 'prewarm',
  QUERYSTRING = 'querystring',
  WAF = 'waf',
}
export enum CdnOperationFunction {
  ANALYTICS_DELETE = 'analytics_delete',
  ANALYTICS_RECOMPUTE = 'analytics_recompute',
  DOMAIN_DELETE = 'domain_delete',
  DOMAIN_DISABLE = 'domain_disable',
  DOMAIN_PURGE = 'domain_purge',
  DOMAIN_REFRESH = 'domain_refresh',
  SERVICE_INSTALL = 'service_install',
  SSL_DELETE = 'ssl_delete',
  SSL_INSTALL = 'ssl_install',
}

export enum CdnSharedOffer {
  ADVANCED = 'advanced',
  BASIC = 'basic',
  SECURITY = 'security',
}

export enum CdnOperationStatus {
  CANCELLED = 'cancelled',
  DOING = 'doing',
  DONE = 'done',
  ERROR = 'error',
  TODO = 'todo',
}

export interface CdnProperties {
  domain: string;
  free: boolean;
  status: CdnStatus;
  taskId: number;
  type: string;
  version: string;
}

export interface CdnAvailableOption {
  category: CdnOptionCategory;
  config: CdnConfigBase;
  destination: CdnConfigBase;
  followUri: CdnConfigBase;
  origins: CdnConfigBase;
  patternType: CdnConfigBase;
  priority: CdnConfigBase;
  queryParameters: CdnConfigBase;
  resources: CdnConfigBase;
  statusCode: CdnConfigBase;
  ttl: CdnConfigBase;
  maxItems: number;
  type: string;
}

export interface CdnDomain {
  creationDate: Date;
  name: string;
  needRefresh: boolean;
  status: CDN_DOMAIN_STATUS;
  updatedDate: Date;
}

export interface CdnDomainOption {
  config: {
    destination?: string;
    followUri?: boolean;
    origins?: string;
    patternType?: CdnPatternType;
    priority?: number;
    queryParameters?: CdnQueryParameterAction;
    resources?: string[];
    statusCode?: number;
    ttl?: number;
  };
  enabled: boolean;
  extra: {
    quota?: number;
    usage?: number;
  };
  name: string;
  pattern?: string;
  type: CdnOptionType;
}
export interface PurgeCDN {
  comment: string;
  creationDate: Date;
  function: CdnOperationFunction;
  id: number;
  parameter: {
    anycastIp?: string;
    cluster?: string;
    date?: Date;
    domainName?: string;
    fingerprint?: string;
    offer?: CdnSharedOffer;
    pattern?: string;
    service?: string;
    sslId?: number;
  };
  service: string;
  status: CdnOperationStatus;
  todoDate: Date;
  updatedDate: Date;
}
