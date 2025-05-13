export const SHARED_CDN_SETTINGS_RULE_CACHE_RULE_PATTERN_REGEX = 'regex';
export const SHARED_CDN_SETTINGS_RULE_FACTOR_DAY = 86400;
export const SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR = 3600;
export const SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE = 60;
export const SHARED_CDN_SETTINGS_RULE_FACTOR_MONTH = 24 * 3600 * 30;
export const SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND = 1;

export const SHARED_CDN_SETTINGS_RULES_NB_RULES_BY_PAGE = 5;

export const SHARED_CDN_RANGE = {
  BASIC: 'BASIC',
  SECURITY: 'SECURITY',
  ADVANCED: 'ADVANCED',
};

export const SHARED_CDN_OPTIONS = {
  PREFETCH: {
    LINKS: {
      DEFAULT:
        'https://docs.ovh.com/gb/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      ASIA:
        'https://docs.ovh.com/asia/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      AU:
        'https://docs.ovh.com/au/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      CA:
        'https://docs.ovh.com/ca/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      DE:
        'https://docs.ovh.com/de/hosting/verwendung_des_geocache_boosters_auf_einem_webhosting/',
      ES:
        'https://docs.ovh.com/es/hosting/guia_de_uso_del_acelerador_geocache_en_un_alojamiento_web/',
      FR:
        'https://docs.ovh.com/fr/hosting/accelerer-mon-site-web-en-utilisant-le-cdn/',
      GB:
        'https://docs.ovh.com/gb/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      IE:
        'https://docs.ovh.com/ie/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      IT:
        'https://docs.ovh.com/it/hosting/guida_allutilizzo_dellacceleratore_geocache_su_un_hosting_web/',
      PL:
        'https://docs.ovh.com/pl/hosting/przewodnik_dotyczacy_uslugi_geocache_na_hostingu_www/',
      PT:
        'https://docs.ovh.com/pt/hosting/guia_de_utilizacao_do_acelerador_geocache_num_alojamento_web/',
      QC:
        'https://docs.ovh.com/ca/fr/hosting/accelerer-mon-site-web-en-utilisant-le-cdn/',
      SG:
        'https://docs.ovh.com/sg/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      WE:
        'https://docs.ovh.com/us/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      WS:
        'https://docs.ovh.com/ca/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
      IN:
        'https://docs.ovh.com/asia/en/hosting/guide_to_using_the_geocache_accelerator_on_a_web_hosting_package/',
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

export const SETTING_BASE_TRACKING_HIT = 'web::hosting::cdn::configure';
