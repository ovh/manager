import { CountryCode } from '@ovh-ux/manager-config';

type GuideLinks = { [key in CountryCode]: string };

export const SUPPORT_URL: Record<string, string> = {
  EU: 'https://help.ovhcloud.com',
  US: 'https://support.us.ovhcloud.com',
};

export const GUIDE_LIST: {
  [guideName: string]: Partial<GuideLinks>;
} = {
  quickStart: {
    ASIA:
      '/csm/asia-kms-quick-start?id=kb_article_view&sysparm_article=KB0063365',
    AU:
      '/csm/en-au-kms-quick-start?id=kb_article_view&sysparm_article=KB0063364',
    CA:
      '/csm/en-ca-kms-quick-start?id=kb_article_view&sysparm_article=KB0063371',
    DE: '/csm/de-kms-quick-start?id=kb_article_view&sysparm_article=KB0063353',
    ES:
      '/csm/es-es-kms-quick-start?id=kb_article_view&sysparm_article=KB0063370',
    FR: '/csm/fr-kms-quick-start?id=kb_article_view&sysparm_article=KB0063369',
    GB:
      '/csm/en-gb-kms-quick-start?id=kb_article_view&sysparm_article=KB0063380',
    IE:
      '/csm/en-ie-kms-quick-start?id=kb_article_view&sysparm_article=KB0063362',
    IT: '/csm/it-kms-quick-start?id=kb_article_view&sysparm_article=KB0063381',
    PL: '/csm/pl-kms-quick-start?id=kb_article_view&sysparm_article=KB0063385',
    PT: '/csm/pt-kms-quick-start?id=kb_article_view&sysparm_article=KB0063388',
    QC:
      '/csm/fr-ca-kms-quick-start?id=kb_article_view&sysparm_article=KB0063373',
    SG:
      '/csm/en-sg-kms-quick-start?id=kb_article_view&sysparm_article=KB0063374',
    US:
      '/hc/en-us/articles/31481250033811-Getting-Started-with-OVHcloud-Key-Management-Service-KMS',
    WE: '/csm/en-kms-quick-start?id=kb_article_view&sysparm_article=KB0063366',
    WS:
      '/csm/es-es-kms-quick-start?id=kb_article_view&sysparm_article=KB0063370',
  },
  usage: {
    ASIA: '/asia-kms-usage?id=kb_article_view&sysparm_article=KB0065030',
    AU: '/csm/en-au-kms-usage?id=kb_article_view&sysparm_article=KB0065021',
    CA: '/csm/en-ca-kms-usage?id=kb_article_view&sysparm_article=KB0065027',
    DE: '/csm/de-kms-usage?id=kb_article_view&sysparm_article=KB0065006',
    ES: '/csm/es-es-kms-usage?id=kb_article_view&sysparm_article=KB0065029',
    FR: '/csm/fr-kms-usage?id=kb_article_view&sysparm_article=KB0065032',
    GB: '/csm/en-gb-kms-usage?id=kb_article_view&sysparm_article=KB0065025',
    IE: '/csm/en-ie-kms-usage?id=kb_article_view&sysparm_article=KB0065024',
    IT: '/csm/it-kms-usage?id=kb_article_view&sysparm_article=KB0065036',
    PL: '/csm/pl-kms-usage?id=kb_article_view&sysparm_article=KB0065026',
    PT: '/csm/pt-kms-usage?id=kb_article_view&sysparm_article=KB0065034',
    QC: '/csm/fr-ca-kms-usage?id=kb_article_view&sysparm_article=KB0065028',
    SG: '/csm/en-sg-kms-usage?id=kb_article_view&sysparm_article=KB0065033',
    US:
      '/hc/en-us/articles/34887531180435-Using-OVHcloud-Key-Management-Service-KMS',
    WE: '/csm/en-kms-usage?id=kb_article_view&sysparm_article=KB0065023',
    WS: '/csm/es-kms-usage?id=kb_article_view&sysparm_article=KB0065031',
  },
  kmip: {
    ASIA: '/csm/asia-kms-kmip?id=kb_article_view&sysparm_article=KB0065012',
    AU: '/csm/en-au-kms-kmip?id=kb_article_view&sysparm_article=KB0065008',
    CA: '/csm/en-ca-kms-kmip?id=kb_article_view&sysparm_article=KB0065013',
    DE: '/csm/de-kms-kmip?id=kb_article_view&sysparm_article=KB0065020',
    ES: '/csm/es-es-kms-kmip?id=kb_article_view&sysparm_article=KB0065010',
    FR: '/csm/fr-kms-kmip?id=kb_article_view&sysparm_article=KB0065019',
    GB: '/csm/en-gb-kms-kmip?id=kb_article_view&sysparm_article=KB0065016',
    IE: '/csm/en-ie-kms-kmip?id=kb_article_view&sysparm_article=KB0065017',
    IT: '/csm/it-kms-kmip?id=kb_article_view&sysparm_article=KB0065009',
    PL: '/csm/pl-kms-kmip?id=kb_article_view&sysparm_article=KB0065014',
    PT: '/csm/pt-kms-kmip?id=kb_article_view&sysparm_article=KB0065007',
    QC: '/csm/fr-ca-kms-kmip?id=kb_article_view&sysparm_article=KB0065022',
    SG: '/csm/en-sg-kms-kmip?id=kb_article_view&sysparm_article=KB0065018',
    US:
      '/hc/en-us/articles/34925746801555-How-to-connect-a-compatible-product-using-KMIP-protocol',
    WE: '/csm/en-kms-kmip?id=kb_article_view&sysparm_article=KB0065015',
    WS: '/csm/es-kms-kmip?id=kb_article_view&sysparm_article=KB0065011',
  },
};
