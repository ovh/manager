export const VRACK_URLS = {
  changeOwner: {
    CZ: 'https://www.ovh.cz/cgi-bin/procedure/procedureChangeOwner.cgi',
    DE: 'https://www.ovh.de/cgi-bin/procedure/procedureChangeOwner.cgi',
    ES: 'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
    FI: 'https://www.ovh.com/cgi-bin/fi/procedure/procedureChangeOwner.cgi',
    FR: 'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
    GB: 'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
    IE: 'https://www.ovh.ie/cgi-bin/procedure/procedureChangeOwner.cgi',
    IT: 'https://www.ovh.it/cgi-bin/procedure/procedureChangeOwner.cgi',
    LT: 'https://www.ovh.com/cgi-bin/lt/procedure/procedureChangeOwner.cgi',
    MA: 'https://www.ovh.ma/cgi-bin/procedure/procedureChangeOwner.cgi',
    NL: 'https://www.ovh.nl/cgi-bin/procedure/procedureChangeOwner.cgi',
    PL: 'https://www.ovh.pl/cgi-bin/procedure/procedureChangeOwner.cgi',
    PT: 'https://www.ovh.pt/cgi-bin/procedure/procedureChangeOwner.cgi',
    SN: 'https://www.ovh.sn/cgi-bin/procedure/procedureChangeOwner.cgi',
    TN: 'https://www.ovh.com/tn/cgi-bin/procedure/procedureChangeOwner.cgi',
  },
  guides: {
    vrack: {
      FR: {
        roadmap:
          'https://www.ovh.com/fr/g2148.public_cloud_et_vrack_-_explications_et_roadmap',
      },
    },
  },
};

export const SLAAC_GUIDES_LINK = {
  DE:
    'https://help.ovhcloud.com/csm/de-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062832',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062833',
  AU:
    'https://help.ovhcloud.com/csm/en-au-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062836',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062827',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062828',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062826',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062829',
  EN:
    'https://help.ovhcloud.com/csm/en-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062838',
  ES:
    'https://help.ovhcloud.com/csm/es-es-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062830',
  WS:
    'https://help.ovhcloud.com/csm/es-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062835',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062834',
  FR:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062825',
  IT:
    'https://help.ovhcloud.com/csm/it-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062839',
  PL:
    'https://help.ovhcloud.com/csm/pl-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062837',
  PT:
    'https://help.ovhcloud.com/csm/pt-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062831',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-configure-an-ipv6-in-a-vrack?id=kb_article_view&sysparm_article=KB0062826',
};

export const FEATURE_NAMES = {
  cloudProject: 'public-cloud',
  dedicatedCloud: 'dedicated-cloud',
  dedicatedCloudDatacenter: 'dedicated-cloud',
  dedicatedServer: 'dedicated-server',
  dedicatedServerInterface: 'dedicated-server',
  ip: 'ip',
  ipLoadbalancing: 'ip-load-balancer',
  legacyVrack: 'vrack',
  managedBareMetal: 'managed-bare-metal',
  managedBareMetalDatacenter: 'managed-bare-metal',
};

export const POLLING_INTERVAL = 500;

export const STATUS = {
  ok: 'ok',
  delivered: 'delivered',
};

export const SLAAC_VALUES = {
  enabled: true,
  disabled: false,
};

export const VRACK_DASHBOARD_TRACKING_PREFIX = 'vrack::dashboard';
export const VRACK_ACTIONS_SUFFIX = 'action';

export default {
  FEATURE_NAMES,
  POLLING_INTERVAL,
  STATUS,
  VRACK_URLS,
  VRACK_DASHBOARD_TRACKING_PREFIX,
  VRACK_ACTIONS_SUFFIX,
};
