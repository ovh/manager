export const DEFAULT_CIDR = 16;

export const DEFAULT_IP = '10.{vlanId}.0.0';

export const DEFAULT_VLAN_ID = 1;

export const NETWORK_ACTIVE_STATUS = 'ACTIVE';

export const VLAN_ID = {
  MIN: 0,
  MAX: 4000,
};

const HELP_DOC_ROOT = 'https://docs.ovh.com/';
const HELP_ROOT = 'https://www.ovhcloud.com/';
const PRIVATE_NETWORK_URL =
  '/publiccloud/network-services/creating-private-network-with-gateway/';
const REGION_AVAILABILITY_URL = '/public-cloud/regions-availability/';

export const GUIDE_LINKS = {
  PRIVATE_NETWORK_WITH_GATEWAY: {
    DEFAULT: `${HELP_DOC_ROOT}gb/en${PRIVATE_NETWORK_URL}`,
    ASIA: `${HELP_DOC_ROOT}asia/en${PRIVATE_NETWORK_URL}`,
    DE: `${HELP_DOC_ROOT}de${PRIVATE_NETWORK_URL}`,
    ES: `${HELP_DOC_ROOT}es${PRIVATE_NETWORK_URL}`,
    IE: `${HELP_DOC_ROOT}ie/en${PRIVATE_NETWORK_URL}`,
    IT: `${HELP_DOC_ROOT}it${PRIVATE_NETWORK_URL}`,
    PL: `${HELP_DOC_ROOT}pl${PRIVATE_NETWORK_URL}`,
    PT: `${HELP_DOC_ROOT}pt${PRIVATE_NETWORK_URL}`,
    GB: `${HELP_DOC_ROOT}gb/en${PRIVATE_NETWORK_URL}`,
    CA: `${HELP_DOC_ROOT}ca/en${PRIVATE_NETWORK_URL}`,
    QC: `${HELP_DOC_ROOT}ca/fr${PRIVATE_NETWORK_URL}`,
    MA: `${HELP_DOC_ROOT}fr${PRIVATE_NETWORK_URL}`,
    SN: `${HELP_DOC_ROOT}fr${PRIVATE_NETWORK_URL}`,
    TN: `${HELP_DOC_ROOT}fr${PRIVATE_NETWORK_URL}`,
    AU: `${HELP_DOC_ROOT}au/en${PRIVATE_NETWORK_URL}`,
    SG: `${HELP_DOC_ROOT}sg/en${PRIVATE_NETWORK_URL}`,
    FR: `${HELP_DOC_ROOT}fr${PRIVATE_NETWORK_URL}`,
    US: `${HELP_DOC_ROOT}us/en${PRIVATE_NETWORK_URL}`,
    WS: `${HELP_DOC_ROOT}us/es${PRIVATE_NETWORK_URL}`,
    WE: `${HELP_DOC_ROOT}ie/en${PRIVATE_NETWORK_URL}`,
  },
  REGION_AVAILABILITY: {
    DEFAULT: `${HELP_ROOT}gb/en${REGION_AVAILABILITY_URL}`,
    ASIA: `${HELP_ROOT}asia${REGION_AVAILABILITY_URL}`,
    DE: `${HELP_ROOT}de${REGION_AVAILABILITY_URL}`,
    ES: `${HELP_ROOT}es-es${REGION_AVAILABILITY_URL}`,
    IE: `${HELP_ROOT}en-ie${REGION_AVAILABILITY_URL}`,
    IT: `${HELP_ROOT}it${REGION_AVAILABILITY_URL}`,
    NL: `${HELP_ROOT}nl${REGION_AVAILABILITY_URL}`,
    PL: `${HELP_ROOT}pl${REGION_AVAILABILITY_URL}`,
    PT: `${HELP_ROOT}pt${REGION_AVAILABILITY_URL}`,
    GB: `${HELP_ROOT}en-gb${REGION_AVAILABILITY_URL}`,
    CA: `${HELP_ROOT}en-ca${REGION_AVAILABILITY_URL}`,
    QC: `${HELP_ROOT}fr-ca${REGION_AVAILABILITY_URL}`,
    MA: `${HELP_ROOT}fr-ma${REGION_AVAILABILITY_URL}`,
    SN: `${HELP_ROOT}fr-sn${REGION_AVAILABILITY_URL}`,
    TN: `${HELP_ROOT}fr-tn${REGION_AVAILABILITY_URL}`,
    AU: `${HELP_ROOT}en-au${REGION_AVAILABILITY_URL}`,
    SG: `${HELP_ROOT}en-sg${REGION_AVAILABILITY_URL}`,
    FR: `${HELP_ROOT}fr${REGION_AVAILABILITY_URL}`,
    WS: `${HELP_ROOT}es${REGION_AVAILABILITY_URL}`,
    WE: `${HELP_ROOT}en${REGION_AVAILABILITY_URL}`,
  },
};

export const TRACKING_PREFIX = 'PublicCloud::add-private-network';

export const LOCAL_ZONE = 'localzone';

export default {
  DEFAULT_CIDR,
  DEFAULT_IP,
  NETWORK_ACTIVE_STATUS,
  VLAN_ID,
  GUIDE_LINKS,
  TRACKING_PREFIX,
  LOCAL_ZONE,
};
