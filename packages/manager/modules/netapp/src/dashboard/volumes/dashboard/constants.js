export const REDHAT_COMMAND = 'sudo yum install nfs-utils';
export const UBUNTU_COMMAND = 'sudo apt-get install nfs-common';
export const FOLDER_CREATION = 'sudo mkdir /media/nfs01';

export const PATTERN = /^[a-zA-Z0-9._-]{1,255}$/;

const getBareMetalGuideUrl = (language, article) =>
  `https://help.ovhcloud.com/csm/${language}-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=${article}`;

export const BARE_METAL_GUIDE = {
  DE: getBareMetalGuideUrl('de', 'KB0062694'),
  ES: getBareMetalGuideUrl('es-es', 'KB0062712'),
  FR: getBareMetalGuideUrl('fr', 'KB0062718'),
  IE: getBareMetalGuideUrl('en-ie', 'KB0062719'),
  IT: getBareMetalGuideUrl('it', 'KB0062713'),
  NL: getBareMetalGuideUrl('en-ie', 'KB0062719'),
  PL: getBareMetalGuideUrl('pl', 'KB0062723'),
  PT: getBareMetalGuideUrl('pt', 'KB0062717'),
  GB: getBareMetalGuideUrl('en-gb', 'KB0062711'),
  CA: getBareMetalGuideUrl('en-ca', 'KB0062716'),
  QC: getBareMetalGuideUrl('fr-ca', 'KB0062721'),
  MA: getBareMetalGuideUrl('fr', 'KB0062718'),
  SN: getBareMetalGuideUrl('fr', 'KB0062718'),
  TN: getBareMetalGuideUrl('fr', 'KB0062718'),
  AU: getBareMetalGuideUrl('en-au', 'KB0062710'),
  IN: getBareMetalGuideUrl('en-in', 'KB0069629'),
  SG: getBareMetalGuideUrl('en-sg', 'KB0062714'),
  ASIA: getBareMetalGuideUrl('en-in', 'KB0069629'),
  WE: getBareMetalGuideUrl('en-ie', 'KB0062719'),
  WS: getBareMetalGuideUrl('en-ie', 'KB0062719'),
  DEFAULT: getBareMetalGuideUrl('en-ie', 'KB0062719'),
};

// @todo: update with the right url & articles.

const getPulibCloudGuideUrl = (language, article) =>
  `https://help.ovhcloud.com/csm/${language}-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=${article}`;

export const PUBLIC_CLOUD_GUIDE = {
  DE: getPulibCloudGuideUrl('de', 'KB0062694'),
  ES: getPulibCloudGuideUrl('es-es', 'KB0062712'),
  FR: getPulibCloudGuideUrl('fr', 'KB0062718'),
  IE: getPulibCloudGuideUrl('en-ie', 'KB0062719'),
  IT: getPulibCloudGuideUrl('it', 'KB0062713'),
  NL: getPulibCloudGuideUrl('en-ie', 'KB0062719'),
  PL: getPulibCloudGuideUrl('pl', 'KB0062723'),
  PT: getPulibCloudGuideUrl('pt', 'KB0062717'),
  GB: getPulibCloudGuideUrl('en-gb', 'KB0062711'),
  CA: getPulibCloudGuideUrl('en-ca', 'KB0062716'),
  QC: getPulibCloudGuideUrl('fr-ca', 'KB0062721'),
  MA: getPulibCloudGuideUrl('fr', 'KB0062718'),
  SN: getPulibCloudGuideUrl('fr', 'KB0062718'),
  TN: getPulibCloudGuideUrl('fr', 'KB0062718'),
  AU: getPulibCloudGuideUrl('en-au', 'KB0062710'),
  IN: getPulibCloudGuideUrl('en-in', 'KB0069629'),
  SG: getPulibCloudGuideUrl('en-sg', 'KB0062714'),
  ASIA: getPulibCloudGuideUrl('en-in', 'KB0069629'),
  WE: getPulibCloudGuideUrl('en-ie', 'KB0062719'),
  WS: getPulibCloudGuideUrl('en-ie', 'KB0062719'),
  DEFAULT: getPulibCloudGuideUrl('en-ie', 'KB0062719'),
};

export default {
  REDHAT_COMMAND,
  UBUNTU_COMMAND,
  FOLDER_CREATION,
  PATTERN,
};
