export enum CdnStatus {
  CREATED = 'created',
  CREATING = 'creating',
  DELETING = 'deleting',
  FLUSHING = 'flushing',
  REOPENING = 'reopening',
  SUSPENDED = 'suspended',
  SUSPENDING = 'suspending',
}

export type ServiceNameCdn = {
  domain: string;
  free: boolean;
  status: CdnStatus;
  taskId: number;
  type: string;
  version: string;
};

export enum PatternType {
  EXTENSION = 'extension',
  FOLDER = 'folder',
  REGEX = 'regex',
  URI = 'uri',
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

export enum CdnQueryParameters {
  IGNORED = 'ignored',
  SORTED = 'sorted',
}

export type CdnOption = {
  config: {
    destination?: string;
    followUri?: boolean;
    origins?: string;
    patternType: PatternType;
    priority: number;
    queryParameters?: CdnQueryParameters;
    resources?: string[];
    statusCode?: number;
    ttl: number;
  };
  enabled: boolean;
  extra?: {
    quota: number;
    usage: number;
  };
  name?: string;
  pattern: string;
  type: CdnOptionType;
};

export type CdnFormValues = {
  brotli: boolean;
  geoHeaders: boolean;
  prefetch: boolean;
  mobileRedirect: boolean;
  devmode: boolean;
  querystring: boolean;
  prewarm: boolean;
  cors: boolean;
  httpsRedirect: boolean;
  hsts: boolean;
  mixedContent: boolean;
  waf: boolean;
  hstsAge: number;
  hstUnit: number;
  mobileRedirectType: string;
  mobileRedirectUrl: string;
  corsResources?: string[];
  premwarmResources?: string[];
  querytringParam: CdnQueryParameters;
  httpsRedirectCode: number;
};

export type TCdnOption = {
  serviceName?: string;
  domain?: string;
  option?: string;
  cdnOption?: CdnOption;
};

export type TCdnOptions = {
  serviceName?: string;
  domain?: string;
  cdnOptions?: CdnOption[];
};
