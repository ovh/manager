export const AS_OPTIONS = ['ovh_cloud', 'own'];
export const CONFIG_NAME = {
  CAMPUS: 'campus',
  IPRIR: 'ipRir',
};

export const GUIDELINK = {
  FR:
    'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044846',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044849',
  PT:
    'https://help.ovhcloud.com/csm/pt-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044863',
  IT:
    'https://help.ovhcloud.com/csm/it-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044860',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044851',
  DE:
    'https://help.ovhcloud.com/csm/de-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044858',
  ES:
    'https://help.ovhcloud.com/csm/es-es-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0031977',
  AU:
    'https://help.ovhcloud.com/csm/en-au-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044847',
  PL:
    'https://help.ovhcloud.com/csm/pl-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044862',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044857',
  WS:
    'https://help.ovhcloud.com/csm/es-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044854',
  MA:
    'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
  SN:
    'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
  TN:
    'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
  IN:
    'https://help.ovhcloud.com/csm/asia-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044845',
  WE:
    'https://help.ovhcloud.com/csm/en-ie-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044851',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044845',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044855',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/7437687367315-How-to-use-the-Bring-Your-Own-IP-BYOIP-feature',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044856',
};

export const STEP_NAME = {
  RIR: 'select-rir',
  LOCATION: 'select-location',
  IP_RANGE: 'select-ip-range',
  AS: 'select-autonomous-system',
};

export const IPV4_BLOCK_PATTERN = /^(?:(?:25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\/((19|2[0-4]))?)$/;

export const BYOIP_FAILOVER_V4 = 'byoip-failover-v4';

export default {
  AS_OPTIONS,
  CONFIG_NAME,
  IPV4_BLOCK_PATTERN,
  STEP_NAME,
  BYOIP_FAILOVER_V4,
};
