export const REDHAT_COMMAND = 'sudo yum install nfs-utils';
export const UBUNTU_COMMAND = 'sudo apt-get install nfs-common';
export const FOLDER_CREATION = 'sudo mkdir /media/nfs01';

export const PATTERN = /^[a-zA-Z0-9._-]{1,255}$/;

export const BASE_1024 = 1024;
export const DEFAULT_SNAPSHOT_SIZE = 5;

const getBareMetalGuideUrl = (language, article) =>
  `https://help.ovhcloud.com/csm/${language}-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=${article}`;

const frBareMetalGuideParams = ['fr', 'KB0062718'];
const enIeBareMetalGuideParams = ['en-ie', 'KB0062719'];

export const BARE_METAL_GUIDE = {
  DE: getBareMetalGuideUrl('de', 'KB0062694'),
  ES: getBareMetalGuideUrl('es-es', 'KB0062712'),
  FR: getBareMetalGuideUrl(...frBareMetalGuideParams),
  IE: getBareMetalGuideUrl(...enIeBareMetalGuideParams),
  IT: getBareMetalGuideUrl('it', 'KB0062713'),
  NL: getBareMetalGuideUrl(...enIeBareMetalGuideParams),
  PL: getBareMetalGuideUrl('pl', 'KB0062723'),
  PT: getBareMetalGuideUrl('pt', 'KB0062717'),
  GB: getBareMetalGuideUrl('en-gb', 'KB0062711'),
  CA: getBareMetalGuideUrl('en-ca', 'KB0062716'),
  QC: getBareMetalGuideUrl('fr-ca', 'KB0062721'),
  MA: getBareMetalGuideUrl(...frBareMetalGuideParams),
  SN: getBareMetalGuideUrl(...frBareMetalGuideParams),
  TN: getBareMetalGuideUrl(...frBareMetalGuideParams),
  AU: getBareMetalGuideUrl('en-au', 'KB0062710'),
  IN: getBareMetalGuideUrl('en-in', 'KB0069629'),
  SG: getBareMetalGuideUrl('en-sg', 'KB0062714'),
  ASIA: getBareMetalGuideUrl('en-in', 'KB0069629'),
  WE: getBareMetalGuideUrl(...enIeBareMetalGuideParams),
  WS: getBareMetalGuideUrl(...enIeBareMetalGuideParams),
  DEFAULT: getBareMetalGuideUrl(...enIeBareMetalGuideParams),
};

const getPulibCloudGuideUrl = (language, article) =>
  `https://help.ovhcloud.com/csm/${language}-public-cloud-storage-netapp-connect-instance-vrack?id=kb_article_view&sysparm_article=${article}`;

const frPulibCloudParams = ['fr', 'KB0073313'];
const enIePulibCloudParams = ['en-ie', 'KB0062719'];

export const PUBLIC_CLOUD_GUIDE = {
  DE: getPulibCloudGuideUrl('de', 'KB0073305'),
  ES: getPulibCloudGuideUrl('es-es', 'KB0073310'),
  FR: getPulibCloudGuideUrl(...frPulibCloudParams),
  IE: getPulibCloudGuideUrl(...enIePulibCloudParams),
  IT: getPulibCloudGuideUrl('it', 'KB0073315'),
  NL: getPulibCloudGuideUrl(...enIePulibCloudParams),
  PL: getPulibCloudGuideUrl('pl', 'KB0073318'),
  PT: getPulibCloudGuideUrl('pt', 'KB0073312'),
  GB: getPulibCloudGuideUrl('en-gb', 'KB0073320'),
  CA: getPulibCloudGuideUrl('en-ca', 'KB0073307'),
  QC: getPulibCloudGuideUrl('fr-ca', 'KB0073309'),
  MA: getPulibCloudGuideUrl(...frPulibCloudParams),
  SN: getPulibCloudGuideUrl(...frPulibCloudParams),
  TN: getPulibCloudGuideUrl(...frPulibCloudParams),
  AU: getPulibCloudGuideUrl('en-au', 'KB0073311'),
  IN: getPulibCloudGuideUrl('en-in', 'KB0073317'),
  SG: getPulibCloudGuideUrl('en-sg', 'KB0073308'),
  ASIA: getPulibCloudGuideUrl('en-in', 'KB0073317'),
  WE: getPulibCloudGuideUrl(...enIePulibCloudParams),
  WS: getPulibCloudGuideUrl('es', 'KB0073314'),
  DEFAULT: getPulibCloudGuideUrl(...enIePulibCloudParams),
};

export default {
  REDHAT_COMMAND,
  UBUNTU_COMMAND,
  FOLDER_CREATION,
  PATTERN,
};
