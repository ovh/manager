import { CountryCode } from '@ovh-ux/manager-config';

const guidesRoot = 'https://help.ovhcloud.com/csm';

type GuideLinks = { [key in CountryCode]: string };

export const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  Home: {
    DE: `${guidesRoot}/de-home/`,
    ES: `${guidesRoot}/es-es-home/`,
    FR: `${guidesRoot}/fr-home/`,
    GB: `${guidesRoot}/en-gb-home/`,
    IE: `${guidesRoot}/en-ie-home/`,
    IT: `${guidesRoot}/it-home/`,
    MA: `${guidesRoot}/fr-ma-home/`,
    NL: `${guidesRoot}/en-nl-home/`,
    PL: `${guidesRoot}/pl-home/`,
    PT: `${guidesRoot}/pt-home/`,
    SN: `${guidesRoot}/fr-sn-home/`,
    TN: `${guidesRoot}/fr-tn-home/`,
    ASIA: `${guidesRoot}/asia-home/`,
    AU: `${guidesRoot}/en-au-home/`,
    CA: `${guidesRoot}/en-ca-home/en/`,
    QC: `${guidesRoot}/fr-ca-home/fr/`,
    IN: `${guidesRoot}/en-in-home/`,
    SG: `${guidesRoot}/en-sg-home/`,
    WE: `${guidesRoot}/en-ie-home/`,
    WS: `${guidesRoot}/es-home/`,
    US: 'https://support.us.ovhcloud.com',
  },
};
