import { CountryCode } from '@ovh-ux/manager-config';

const guidesRoot = 'https://docs.ovh.com';

type GuideLinks = { [key in CountryCode | string]: string };

export const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  Home: {
    DE: `${guidesRoot}/de/`,
    ES: `${guidesRoot}/es/`,
    FR: `${guidesRoot}/fr/`,
    GB: `${guidesRoot}/gb/en/`,
    IE: `${guidesRoot}/ie/en/`,
    IT: `${guidesRoot}/it/`,
    MA: `${guidesRoot}/fr/`,
    NL: `${guidesRoot}/nl/`,
    PL: `${guidesRoot}/pl/`,
    PT: `${guidesRoot}/pt/`,
    SN: `${guidesRoot}/fr/`,
    TN: `${guidesRoot}/fr/`,
    ASIA: `${guidesRoot}/asia/en/`,
    AU: `${guidesRoot}/au/en/`,
    CA: `${guidesRoot}/ca/en/`,
    QC: `${guidesRoot}/ca/fr/`,
    SG: `${guidesRoot}/sg/en/`,
    WE: `${guidesRoot}/us/en/`,
    WS: `${guidesRoot}/us/es/`,
    US: 'https://support.us.ovhcloud.com',
  },
};
