export const MINIMUM_VOLUME_SIZE = 100;
export const SERVICE_TYPE = 'NETAPP';

const COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA = {
  campaignId: '[commit-recommit]',
  creation: '[batch1]',
  format: '[link]',
  generalPlacement: '[netapp]',
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

export const VOLUME_TRACKING_PREFIX =
  'Storage_backup::storage_backup::netapp::';

export const VOLUME_TRACKING_CONTEXT = {
  page: {
    name: `${VOLUME_TRACKING_PREFIX}netapp::volumes::listing`,
  },
  page_theme: 'Storage_backup',
  page_category: 'listing',
  level2: 130,
};

export const NETWORK_STATUS = {
  TO_CONFIGURE: 'to_configure',
  ASSOCIATING: 'associating',
  ASSOCIATED: 'associated',
  DISSOCIATING: 'dissociating',
};

export const VRACK_SERVICES_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  DISABLED: 'DISABLED',
};

export const POLLING_TYPE = {
  ASSOCIATING: 'associating',
  DISSOCIATING: 'dissociating',
};

export const FETCH_INTERVAL = 5000;

const getVrackOrderUrl = (host) =>
  `https://${host}/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))`;

export const VRACK_ORDER_URLS = {
  CZ: getVrackOrderUrl('www.ovh.cz'),
  DE: getVrackOrderUrl('www.ovh.de'),
  ES: getVrackOrderUrl('www.ovh.es'),
  FI: getVrackOrderUrl('www.ovh-hosting.fi'),
  FR: getVrackOrderUrl('www.ovh.com/fr'),
  GB: getVrackOrderUrl('www.ovh.co.uk'),
  IE: getVrackOrderUrl('www.ovh.ie'),
  IT: getVrackOrderUrl('www.ovh.it'),
  LT: getVrackOrderUrl('www.ovh.lt'),
  MA: getVrackOrderUrl('www.ovh.ma'),
  NL: getVrackOrderUrl('www.ovh.nl'),
  PL: getVrackOrderUrl('www.ovh.pl'),
  PT: getVrackOrderUrl('www.ovh.pt'),
  SN: getVrackOrderUrl('www.ovh.sn'),
  TN: getVrackOrderUrl('www.ovh.com/tn'),
  US: getVrackOrderUrl('us.ovhcloud.com'),
  ASIA: getVrackOrderUrl('ca.ovh.com/asia'),
  IN: getVrackOrderUrl('ca.ovh.com/in'),
  AU: getVrackOrderUrl('ca.ovh.com/au'),
  CA: getVrackOrderUrl('ca.ovh.com/en'),
  QC: getVrackOrderUrl('ca.ovh.com/fr'),
  SG: getVrackOrderUrl('ca.ovh.com/sg'),
  WE: getVrackOrderUrl('us.ovh.com/us'),
  WS: getVrackOrderUrl('us.ovh.com/es'),
  DEFAULT: getVrackOrderUrl('www.ovh.ie'),
};

const getGuideLink = (language, article) =>
  `https://help.ovhcloud.com/csm/${language}-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=${article}`;

export const CONFIGURATION_GUIDE_LINKS = {
  DE: getGuideLink('de', 'KB0062694'),
  ES: getGuideLink('es-es', 'KB0062712'),
  FR: getGuideLink('fr', 'KB0062718'),
  IE: getGuideLink('en-ie', 'KB0062719'),
  IT: getGuideLink('it', 'KB0062713'),
  NL: getGuideLink('en-ie', 'KB0062719'),
  PL: getGuideLink('pl', 'KB0062723'),
  PT: getGuideLink('pt', 'KB0062717'),
  GB: getGuideLink('en-gb', 'KB0062711'),
  CA: getGuideLink('en-ca', 'KB0062716'),
  QC: getGuideLink('fr-ca', 'KB0062721'),
  MA: getGuideLink('fr', 'KB0062718'),
  SN: getGuideLink('fr', 'KB0062718'),
  TN: getGuideLink('fr', 'KB0062718'),
  AU: getGuideLink('en-au', 'KB0062710'),
  IN: getGuideLink('en-in', 'KB0069629'),
  SG: getGuideLink('en-sg', 'KB0062714'),
  ASIA: getGuideLink('en-in', 'KB0069629'),
  WE: getGuideLink('en-ie', 'KB0062719'),
  WS: getGuideLink('en-ie', 'KB0062719'),
  DEFAULT: getGuideLink('en-ie', 'KB0062719'),
};

export const LABELS = {
  VRACK: 'vRack',
  VRACK_SERVICE: 'vRack Services',
};

export const NETAPP_NAME_PATTERN = /^[a-zA-Z0-9._-]{1,64}$/;

export const MOUNT_PATH_PATTERN = /^[\w-_]+$/;

export const MAX_CHAR_LIMIT = 255;

export const SNAPSHOT_TYPE = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual',
  SYSTEM: 'system',
};

export const CUSTOM_SELECTION = 'Custom';

export const ACTIVES_NFS_LIMITE = 5;

export default {
  MINIMUM_VOLUME_SIZE,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  NETWORK_STATUS,
  FETCH_INTERVAL,
  POLLING_TYPE,
  VRACK_SERVICES_STATUS,
  VRACK_ORDER_URLS,
  LABELS,
  NETAPP_NAME_PATTERN,
  MOUNT_PATH_PATTERN,
  MAX_CHAR_LIMIT,
  SNAPSHOT_TYPE,
  CUSTOM_SELECTION,
};
