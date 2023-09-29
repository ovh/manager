import { buildURL, ParamValueType } from '@ovh-ux/url-builder';

export type Region = 'US' | 'CA' | 'EU';

export const defaultRegion = 'EU' as Region;

export const hostnameByRegion: Record<Region, string> = {
  EU: 'www.ovh.com/',
  CA: 'ca.ovh.com/',
  US: 'us.ovhcloud.com/',
};

export type Subsidiary =
  | 'US'
  | 'DE'
  | 'ES'
  | 'FR'
  | 'GB'
  | 'IE'
  | 'IT'
  | 'MA'
  | 'NL'
  | 'PL'
  | 'PT'
  | 'SN'
  | 'TN'
  | 'ASIA'
  | 'AU'
  | 'CA'
  | 'QC'
  | 'SG'
  | 'WE'
  | 'WS';

export const defaultSubsidiary = 'FR' as Subsidiary;

export type BaseUrlPerSub = { [key in Subsidiary]: string };
export type BaseUrlsPerRegion = { [key in Region]: Partial<BaseUrlPerSub> };

export const baseUrls: BaseUrlsPerRegion = {
  EU: {
    DE: `${hostnameByRegion.EU}de/`,
    ES: `${hostnameByRegion.EU}es/`,
    FR: `${hostnameByRegion.EU}fr/`,
    GB: `${hostnameByRegion.EU}en-gb/`,
    IE: `${hostnameByRegion.EU}en-ie/`,
    IT: `${hostnameByRegion.EU}it/`,
    MA: `${hostnameByRegion.EU}fr-ma/`,
    NL: `${hostnameByRegion.EU}en-ie/`,
    PL: `${hostnameByRegion.EU}pl/`,
    PT: `${hostnameByRegion.EU}pt/`,
    SN: `${hostnameByRegion.EU}fr-sn/`,
    TN: `${hostnameByRegion.EU}fr-tn/`,
  },
  CA: {
    ASIA: `${hostnameByRegion.CA}asia/`,
    AU: `${hostnameByRegion.CA}en-au/`,
    CA: `${hostnameByRegion.CA}en-ca/`,
    QC: `${hostnameByRegion.CA}fr-ca/`,
    SG: `${hostnameByRegion.CA}en-sg/`,
    WE: `${hostnameByRegion.CA}en/`,
    WS: `${hostnameByRegion.CA}es/`,
  },
  US: {
    US: hostnameByRegion.US,
  },
};

export const getURL = ({
  region,
  subsidiary,
  appPublicURL,
  path = '',
  params = {},
}: {
  appPublicURL?: string;
  region?: Region;
  subsidiary?: Subsidiary;
  path?: string;
  params?: Record<string, ParamValueType>;
}): string =>
  buildURL(
    appPublicURL ??
      baseUrls[region as Region]?.[subsidiary as Subsidiary] ??
      hostnameByRegion[region as Region] ??
      window.location.origin,
    path,
    params,
  );
