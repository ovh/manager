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
      '/csm/en-sg-kms-quick-start?id=kb_article_view&sysparm_article=KB006337',
    US:
      '/hc/en-us/articles/31481250033811-Getting-Started-with-OVHcloud-Key-Management-Service-KMS',
    WE: '/csm/en-kms-quick-start?id=kb_article_view&sysparm_article=KB0063366',
    WS:
      '/csm/es-es-kms-quick-start?id=kb_article_view&sysparm_article=KB0063370',
  },
};
