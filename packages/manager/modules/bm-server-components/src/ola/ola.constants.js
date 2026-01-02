export const OLA_PLAN_CODE = 'ovh-link-aggregation-infra';

export const OLA_MODES = {
  DOUBLE_LAG: 'double_lag',
  FULL_LAG: 'full_lag',
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  VRACK_AGGREGATION: 'vrack_aggregation',
  PUBLIC_AGGREGATION: 'public_aggregation',
  PUBLIC: 'public',
  VRACK: 'vrack',
  DEFAULT: 'default',
};

export const INTERFACE_TASK = 'INFRA_002_VirtualNetworkInterface';
export const INTERFACE_GROUP_TASK = 'INFRA_002_VirtualNetworkInterface_group';
export const INTERFACE_UNGROUP_TASK =
  'INFRA_002_VirtualNetworkInterface_ungroup';


export const OLA_PREVIEW_ID = 'ola_preview';
export const NEW_LACP_MODE_BANNER_FEATURE_ID =
  'dedicated-server:ola-new-lacp-mode-banner';

export const SCALE_HGR_MAC_COUNTER = 4;

export const NETWORK_RESILIENCE_GUIDES = {
  ASIA:
    'https://help.ovhcloud.com/csm/asia-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073254',
  AU:
    'https://help.ovhcloud.com/csm/en-au-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073248',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073250',
  DE:
    'https://help.ovhcloud.com/csm/de-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073251',
  ES:
    'https://help.ovhcloud.com/csm/es-es-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073260',
  FR:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073246',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073259',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073256',
  IT:
    'https://help.ovhcloud.com/csm/it-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073255',
  PL:
    'https://help.ovhcloud.com/csm/pl-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073252',
  PT:
    'https://help.ovhcloud.com/csm/pt-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073253',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073247',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/45895810611603-Improving-network-resilience-on-Bare-Metal-servers',
  IN:
    'https://help.ovhcloud.com/csm/en-in-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073258',
  default:
    'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-improve-network-resilience?id=kb_article_view&sysparm_article=KB0073256',
};

export default {
  OLA_PLAN_CODE,
  OLA_MODES,
  INTERFACE_TASK,
  INTERFACE_GROUP_TASK,
  INTERFACE_UNGROUP_TASK,
  OLA_PREVIEW_ID,
};
