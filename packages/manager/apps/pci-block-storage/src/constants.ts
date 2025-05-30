import {
  ChangelogLinks,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';

export type UrlRecord = { [Key in OvhSubsidiary]?: string } & {
  DEFAULT: string;
};

export const LOCAL_ZONE_INFO_URL: UrlRecord = {
  DEFAULT: 'https://ovhcloud.com/en/public-cloud/local-zone-compute/',
  ASIA: 'https://ovhcloud.com/asia/public-cloud/local-zone-compute/',
  DE: 'https://ovhcloud.com/de/public-cloud/local-zone-compute/',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/local-zone-compute/',
  IE: 'https://ovhcloud.com/en-ie/public-cloud/local-zone-compute/',
  IT: 'https://ovhcloud.com/it/public-cloud/local-zone-compute/',
  NL: 'https://ovhcloud.com/nl/public-cloud/local-zone-compute/',
  PL: 'https://ovhcloud.com/pl/public-cloud/local-zone-compute/',
  PT: 'https://ovhcloud.com/pt/public-cloud/local-zone-compute/',
  GB: 'https://ovhcloud.com/en-gb/public-cloud/local-zone-compute/',
  CA: 'https://ovhcloud.com/en-ca/public-cloud/local-zone-compute/',
  QC: 'https://ovhcloud.com/fr-ca/public-cloud/local-zone-compute/',
  MA: 'https://ovhcloud.com/fr-ma/public-cloud/local-zone-compute/',
  SN: 'https://ovhcloud.com/fr-sn/public-cloud/local-zone-compute/',
  TN: 'https://ovhcloud.com/fr-tn/public-cloud/local-zone-compute/',
  AU: 'https://ovhcloud.com/en-au/public-cloud/local-zone-compute/',
  SG: 'https://ovhcloud.com/en-sg/public-cloud/local-zone-compute/',
  FR: 'https://ovhcloud.com/fr/public-cloud/local-zone-compute/',
  WE: 'https://ovhcloud.com/us-en/public-cloud/local-zone-compute/',
  WS: 'https://ovhcloud.com/us-en/public-cloud/local-zone-compute/',
  US: 'https://us.ovhcloud.com/public-cloud/local-zone-compute/',
};

export const GLOBAL_REGIONS_INFO_URL: UrlRecord = {
  DEFAULT: 'https://ovhcloud.com/en/public-cloud/compute/',
  ASIA: 'https://ovhcloud.com/asia/public-cloud/compute/',
  DE: 'https://ovhcloud.com/de/public-cloud/compute/',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/compute/',
  IE: 'https://ovhcloud.com/en-ie/public-cloud/compute/',
  IT: 'https://ovhcloud.com/it/public-cloud/compute/',
  NL: 'https://ovhcloud.com/nl/public-cloud/compute/',
  PL: 'https://ovhcloud.com/pl/public-cloud/compute/',
  PT: 'https://ovhcloud.com/pt/public-cloud/compute/',
  GB: 'https://ovhcloud.com/en-gb/public-cloud/compute/',
  CA: 'https://ovhcloud.com/en-ca/public-cloud/compute/',
  QC: 'https://ovhcloud.com/fr-ca/public-cloud/compute/',
  MA: 'https://ovhcloud.com/fr-ma/public-cloud/compute/',
  SN: 'https://ovhcloud.com/fr-sn/public-cloud/compute/',
  TN: 'https://ovhcloud.com/fr-tn/public-cloud/compute/',
  AU: 'https://ovhcloud.com/en-au/public-cloud/compute/',
  SG: 'https://ovhcloud.com/en-sg/public-cloud/compute/',
  FR: 'https://ovhcloud.com/fr/public-cloud/compute/',
  WS: 'https://ovhcloud.com/us-en/public-cloud/compute/',
  US: 'https://us.ovhcloud.com/public-cloud/compute/',
  WE: 'https://ovhcloud.com/us-en/public-cloud/compute/',
};

export const URL_INFO = {
  GLOBAL_REGIONS: GLOBAL_REGIONS_INFO_URL,
  LOCAL_ZONE: LOCAL_ZONE_INFO_URL,
};

export const MULTI_ATTACH_INFO_URL: UrlRecord = {
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067595',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067595',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067598',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067608',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067601',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067604',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067613',
  NL:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067613',
  US:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067607',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067599',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067606',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067603',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067596',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067600',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067594',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067602',

  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067602',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067602',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067602',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067597',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-classic-multi-attach-3az?id=kb_article_view&sysparm_article=KB0067607',
};

export const DEPLOYMENT_MODES_HELP_URL: UrlRecord = {
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067025',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067029',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067028',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067024',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067034',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067025',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067035',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067014',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067026',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067031',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067036',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067031',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067031',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067031',
  NL:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067034',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067032',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067033',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067037',
  US:
    'https://help.ovhcloud.com/csm/en-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067027',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067030',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-deployments-modes-reference-architecture?id=kb_article_view&sysparm_article=KB0067027',
};

export const VOLUME_MIN_SIZE = 10; // 10 Gio
export const VOLUME_UNLIMITED_QUOTA = -1; // Should be 10 * 1024 (but API is wrong)
export const ALPHA_CHARACTERS_REGEX = /^[a-zA-Z-]+$/;
export const VOLUME_ADDON_FAMILY = 'volume';

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Storage',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Storage',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};
