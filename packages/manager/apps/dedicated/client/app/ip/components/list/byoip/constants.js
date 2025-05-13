export const TRACKING_PREFIX = 'dedicated::ip';
export const TRACKING_PREFIX_SLICE = `${TRACKING_PREFIX}::slice-ip-block`;
export const TRACKING_PREFIX_AGGREGATE = `${TRACKING_PREFIX}::merge-ip-block`;
export const BYOIP_SLICE_PARK_IT_FIRST_ERROR_REGEX = /routed to a service.*park it first/;
export const BYOIP_USAGE_GUIDE_URL = {
  DE:
    'https://help.ovhcloud.com/csm/de-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044858',
  ES:
    'https://help.ovhcloud.com/csm/es-es-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0031977',
  FR:
    'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044851',
  IT:
    'https://help.ovhcloud.com/csm/it-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044860',
  NL:
    'https://help.ovhcloud.com/csm/en-ie-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044851',
  PL:
    ' https://help.ovhcloud.com/csm/pl-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044862',
  PT:
    'https://help.ovhcloud.com/csm/pt-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044863',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044849',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044846',
  US: 'https://us.ovhcloud.com/support/',
  MA:
    'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
  SN:
    'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
  TN:
    'https://help.ovhcloud.com/csm/fr-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044867',
  AU:
    'https://help.ovhcloud.com/csm/en-au-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044847',
  IN:
    'https://help.ovhcloud.com/csm/asia-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044845',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044855',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044845',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-gb-network-bring-your-own-ip?id=kb_article_view&sysparm_article=KB0044849',
};

export const US_API_CONSOLE_LINK = 'https://api.us.ovhcloud.com/console/';

export default {
  TRACKING_PREFIX_SLICE,
  TRACKING_PREFIX_AGGREGATE,
  BYOIP_SLICE_PARK_IT_FIRST_ERROR_REGEX,
  BYOIP_USAGE_GUIDE_URL,
  US_API_CONSOLE_LINK,
};
