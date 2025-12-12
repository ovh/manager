const SUFFIX_ORDER_URL =
  "/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}";

export const DOMAIN_ORDER_OPTIONS_SERVICE = {
  CZ: `https://www.ovh.cz${SUFFIX_ORDER_URL}`,
  DE: `https://www.ovh.de${SUFFIX_ORDER_URL}`,
  EN: `https://www.ovh.co.uk${SUFFIX_ORDER_URL}`,
  ES: `https://www.ovh.es${SUFFIX_ORDER_URL}`,
  FI: `https://www.ovh-hosting.fi${SUFFIX_ORDER_URL}`,
  FR: `https://www.ovh.com/fr${SUFFIX_ORDER_URL}`,
  GB: `https://www.ovh.co.uk${SUFFIX_ORDER_URL}`,
  IE: `https://www.ovh.ie${SUFFIX_ORDER_URL}`,
  IT: `https://www.ovh.it${SUFFIX_ORDER_URL}`,
  LT: `https://www.ovh.lt${SUFFIX_ORDER_URL}`,
  MA: `https://www.ovh.com/ma${SUFFIX_ORDER_URL}`,
  NL: `https://www.ovh.nl${SUFFIX_ORDER_URL}`,
  PL: `https://www.ovh.pl${SUFFIX_ORDER_URL}`,
  PT: `https://www.ovh.pt${SUFFIX_ORDER_URL}`,
  RU: `https://www.ovh.ie${SUFFIX_ORDER_URL}`,
  SN: `https://www.ovh.sn${SUFFIX_ORDER_URL}`,
  TN: `https://www.ovh.com${SUFFIX_ORDER_URL}`,
};

export const DOMAIN_ORDER_URL = {
  EU: {
    CZ: 'https://www.ovh.ie/order/webcloud/',
    DE: 'https://www.ovh.de/order/webcloud/',
    ES: 'https://www.ovh.es/order/webcloud/',
    FI: 'https://www.ovh.ie/order/webcloud/',
    FR: 'https://www.ovh.com/fr/order/webcloud/',
    GB: 'https://www.ovh.co.uk/order/webcloud',
    IE: 'https://www.ovh.ie/order/webcloud',
    IT: 'https://www.ovh.it/order/webcloud/',
    LT: 'https://www.ovh.lt/order/webcloud/',
    NL: 'https://www.ovh.nl/order/webcloud/',
    PL: 'https://www.ovh.pl/order/webcloud/',
    PT: 'https://www.ovh.pt/order/webcloud/',
    MA: 'https://www.ovh.com/ma/order/webcloud',
    SN: 'https://www.ovh.sn/order/webcloud',
    TN: 'https://www.ovh.com/tn/order/webcloud',
  },
  CA: {
    ASIA: 'https://ca.ovh.com/asia/order/webcloud',
    IN: 'https://ca.ovh.com/in/order/webcloud',
    AU: 'https://ca.ovh.com/au/order/webcloud',
    CA: 'https://ca.ovh.com/en/order/webcloud',
    QC: 'https://ca.ovh.com/fr/order/webcloud',
    SG: 'https://ca.ovh.com/sg/order/webcloud',
  },
};

export enum REGION {
  EU = 'EU',
  CA = 'CA',
}

export enum ACTIONS {
  ORDER = 'ORDER',
  ATTACH = 'ATTACH',
}

export const LOCAL_SEO_VISIBILITY_CHECKER =
  'https://www.ovh.com/fr/hebergement-web/referencement-local.xml';

export const LOCAL_SEO_ORDER_OPTIONS_SERVICE = {
  FR: "https://www.ovh.com/fr/order/domain/#/legacy/domain/hosting/choose?options=~(flow~'hosting_existing_service~serviceName~'{serviceName})",
};

export const LOCAL_SEO_INTERFACE =
  'https://localseo.hosting.ovh.net/{lang}/app/ovh?access_token={token}';
export const SHARED_CDN_OPTIONS = {
  PREFETCH: {
    LINKS: {
      DEFAULT:
        'https://docs.ovh.com/gb/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      ASIA: 'https://docs.ovh.com/asia/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      AU: 'https://docs.ovh.com/au/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      CA: 'https://docs.ovh.com/ca/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      DE: 'https://docs.ovh.com/de/hosting/verwendung_des_geocache_boosters_auf_einem_webhosting/',
      ES: 'https://docs.ovh.com/es/hosting/guia_de_uso_del_acelerador_geocache_en_un_alojamiento_web/',
      FR: 'https://docs.ovh.com/fr/hosting/accelerer-mon-site-web-en-utilisant-le-cdn/',
      GB: 'https://docs.ovh.com/gb/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      IE: 'https://docs.ovh.com/ie/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      IT: 'https://docs.ovh.com/it/hosting/guida_allutilizzo_dellacceleratore_geocache_su_un_hosting_web/',
      PL: 'https://docs.ovh.com/pl/hosting/przewodnik_dotyczacy_uslugi_geocache_na_hostingu_www/',
      PT: 'https://docs.ovh.com/pt/hosting/guia_de_utilizacao_do_acelerador_geocache_num_alojamento_web/',
      QC: 'https://docs.ovh.com/ca/fr/hosting/accelerer-mon-site-web-en-utilisant-le-cdn/',
      SG: 'https://docs.ovh.com/sg/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      WE: 'https://docs.ovh.com/us/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      WS: 'https://docs.ovh.com/ca/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      IN: 'https://docs.ovh.com/asia/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
    },
  },
  HSTS: {
    FIXED_NUMBER: 2,
  },
  QUERY_STRING: {
    SORT_PARAMS: { SORT: 'sorted', IGNORED: 'ignored' },
  },
  MOBILE_REDIRECT: {
    STILL_URL: 'still',
    KEEP_URL: 'keep',
  },
};

export const CDN_ADVANCED = 'cdn-advanced';
export const MAX_URL_ENTRIES = 100;
