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
  {
    id: 'policies-ui',
    link: {
      default:
        'https://help.ovhcloud.com/csm/en-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058729',
      de_DE:
        'https://help.ovhcloud.com/csm/de-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058723',
      en_GB:
        'https://help.ovhcloud.com/csm/en-gb-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058725',
      es_ES:
        'https://help.ovhcloud.com/csm/es-es-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058728',
      fr_CA:
        'https://help.ovhcloud.com/csm/fr-ca-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058735',
      fr_FR:
        'https://help.ovhcloud.com/csm/fr-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058730',
      it_IT:
        'https://help.ovhcloud.com/csm/it-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058734',
      pl_PL:
        'https://help.ovhcloud.com/csm/pl-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058733',
      pt_PT:
        'https://help.ovhcloud.com/csm/pt-customer-iam-policies-ui?id=kb_article_view&sysparm_article=KB0058731',
    },
  },
  {
    id: 'policies-api',
    link: {
      default:
        'https://help.ovhcloud.com/csm/en-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056805',
      de_DE:
        'https://help.ovhcloud.com/csm/de-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056810',
      en_GB:
        'https://help.ovhcloud.com/csm/en-gb-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056801',
      es_ES:
        'https://help.ovhcloud.com/csm/es-es-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056800',
      fr_CA:
        'https://help.ovhcloud.com/csm/fr-ca-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056804',
      fr_FR:
        'https://help.ovhcloud.com/csm/fr-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056808',
      it_IT:
        'https://help.ovhcloud.com/csm/it-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056796',
      pl_PL:
        'https://help.ovhcloud.com/csm/pl-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056807',
      pt_PT:
        'https://help.ovhcloud.com/csm/pt-customer-iam-policies-api?id=kb_article_view&sysparm_article=KB0056798',
    },
  },
];

export const SMALL_DEVICE_MAX_SIZE = '30em';

export default {
  GUIDES,
  SMALL_DEVICE_MAX_SIZE,
};
