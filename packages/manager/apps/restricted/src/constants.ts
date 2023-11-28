export type Guide = {
  id: string;
  link: Record<string, string>;
};

export const GUIDES: Guide[] = [
  {
    id: 'control-panel-access',
    link: {
      default:
        'https://help.ovhcloud.com/csm/en-customer-iam-control-panel-access?id=kb_article_view&sysparm_article=KB0058718',
      de_DE:
        'https://help.ovhcloud.com/csm/de-customer-iam-control-panel-access?id=kb_article_view&sysparm_article=KB0058708',
      en_GB:
        'https://help.ovhcloud.com/csm/en-gb-customer-iam-control-panel-access?id=kb_article_view&sysparm_article=KB0058715',
      es_ES:
        'https://help.ovhcloud.com/csm/es-es-customer-iam-control-panel-access?id=kb_article_view&sysparm_article=KB0058707',
      fr_CA:
        'https://help.ovhcloud.com/csm/fr-ca-customer-iam-control-panel-access?id=kb_article_view&sysparm_article=KB0058712',
      fr_FR:
        'https://help.ovhcloud.com/csm/fr-customer-iam-control-panel-access?id=kb_article_view&sysparm_article=KB0058714',
      it_IT:
        'https://help.ovhcloud.com/csm/it-customer-iam-control-panel-access?id=kb_article_view&sysparm_article=KB0058717',
      pl_PL:
        'https://help.ovhcloud.com/csm/pl-customer-iam-control-panel-access?id=kb_article_view&sysparm_article=KB0058710',
      pt_PT:
        'https://help.ovhcloud.com/csm/pt-customer-iam-control-panel-access?id=kb_article_view&sysparm_article=KB0058719',
    },
  },
];

export const SMALL_DEVICE_MAX_SIZE = '30em';

export const US_GUIDE =
  'https://support.us.ovhcloud.com/hc/en-us/articles/19185780752019-Using-IAM-Policies-with-the-OVHcloud-Control-Panel';

export default {
  GUIDES,
  SMALL_DEVICE_MAX_SIZE,
};
