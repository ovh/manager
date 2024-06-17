export const PREFIX_TRACKING_DASHBOARD = 'dashboard';

export const PREFIX_TRACKING_DASHBOARD_PARTITIONS = `${PREFIX_TRACKING_DASHBOARD}::nasha-partitions`;

const COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA = {
  campaignId: '[commit-recommit]',
  creation: '[batch2]',
  format: '[link]',
  generalPlacement: '[nasha]',
  detailedPlacement: '[commitment]',
};

export const COMMIT_IMPRESSION_TRACKING_DATA = {
  ...COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA,
  variant: '[commit]',
};

export const RECOMMIT_IMPRESSION_TRACKING_DATA = {
  ...COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA,
  variant: '[recommit]',
};

export const SERVICE_TYPE = 'DEDICATED_NASHA';

export const GUIDES_URL = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046698',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046689',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046695',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046703',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046701',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046699',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046698',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046694',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046700',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046704',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0033989',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046704',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046704',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046704',
};
export default {
  PREFIX_TRACKING_DASHBOARD,
  PREFIX_TRACKING_DASHBOARD_PARTITIONS,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  SERVICE_TYPE,
  GUIDES_URL,
};
