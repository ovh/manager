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

export const MANAGED_WORDPRESS_URL = 'https://www.ovhcloud.com/fr/managed-hosting-wordpress/';

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

export const REPOSITORY_PLACEHOLDER = 'https://github.com/username/repositoryname';
export const EXAMPLE_HTTPS_REPOSITORY_URL = 'https://github.com/username/respositoryname.git';
export const EXAMPLE_SSH_REPOSITORY_URL = 'git@github.com:username/respositoryname.git';
export const EXAMPLE_BRANCHES_NAMES = '"main", "master", ...';
export const GITHUB_VCS = 'github';
export const REGEX_GIT_REPO =
  /^(https:\/\/github.com\/[^/]+\/.+\.git|git@github.com:[^/]+\/.+\.git)$/;

const PREFIX_GIT_ASSOCIATION = 'https://help.ovhcloud.com/csm/';

export const GIT_ASSOCIATION_GUIDE_LINK = {
  DE: `${PREFIX_GIT_ASSOCIATION}de-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063761`,
  ES: `${PREFIX_GIT_ASSOCIATION}es-es-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063758`,
  FR: `${PREFIX_GIT_ASSOCIATION}fr-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063755`,
  IE: `${PREFIX_GIT_ASSOCIATION}en-ie-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063757`,
  IT: `${PREFIX_GIT_ASSOCIATION}it-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063763`,
  NL: `${PREFIX_GIT_ASSOCIATION}en-ie-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063757`,
  PL: `${PREFIX_GIT_ASSOCIATION}pl-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063765`,
  PT: `${PREFIX_GIT_ASSOCIATION}pt-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063752`,
  GB: `${PREFIX_GIT_ASSOCIATION}en-gb-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063762`,
  CA: `${PREFIX_GIT_ASSOCIATION}en-ca-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063759`,
  QC: `${PREFIX_GIT_ASSOCIATION}fr-ca-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063764`,
  MA: `${PREFIX_GIT_ASSOCIATION}fr-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063755`,
  SN: `${PREFIX_GIT_ASSOCIATION}fr-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063755`,
  TN: `${PREFIX_GIT_ASSOCIATION}fr-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063755`,
  AU: `${PREFIX_GIT_ASSOCIATION}en-au-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063766`,
  IN: `${PREFIX_GIT_ASSOCIATION}asia-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063756`,
  SG: `${PREFIX_GIT_ASSOCIATION}en-sg-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063753`,
  ASIA: `${PREFIX_GIT_ASSOCIATION}asia-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063756`,
  WE: `${PREFIX_GIT_ASSOCIATION}en-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063754`,
  WS: `${PREFIX_GIT_ASSOCIATION}es-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063760`,
  DEFAULT: `${PREFIX_GIT_ASSOCIATION}en-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063754`,
};

const PREFIX_GITHUB_DOCS_URL = 'https://docs.github.com/';
const SUFFIX_GITHUB_WEBHOOK_DOCS_URL =
  '/apps/github-marketplace/listing-an-app-on-github-marketplace/configuring-a-webhook-to-notify-you-of-plan-changes';
export const GIT_WEBHOOK_GUIDE_LINK = {
  DE: `${PREFIX_GITHUB_DOCS_URL}de${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  ES: `${PREFIX_GITHUB_DOCS_URL}es${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  FR: `${PREFIX_GITHUB_DOCS_URL}fr${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  QC: `${PREFIX_GITHUB_DOCS_URL}fr${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  MA: `${PREFIX_GITHUB_DOCS_URL}fr${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  SN: `${PREFIX_GITHUB_DOCS_URL}fr${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  TN: `${PREFIX_GITHUB_DOCS_URL}fr${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  WS: `${PREFIX_GITHUB_DOCS_URL}es${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  DEFAULT: `${PREFIX_GITHUB_DOCS_URL}en${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
};

const SUFFIX_CHANGE_OWNER = '/procedure/procedureChangeOwner.cgi';
export const CHANGE_OWNER_LINK = {
  CZ: `https://www.ovh.cz/cgi-bin${SUFFIX_CHANGE_OWNER}`,
  DE: `https://www.ovh.de/cgi-bin${SUFFIX_CHANGE_OWNER}`,
  ES: `https://www.ovh.es/cgi-bin${SUFFIX_CHANGE_OWNER}`,
  FI: `https://www.ovh.com/cgi-bin/fi${SUFFIX_CHANGE_OWNER}`,
  FR: `https://www.ovh.com/cgi-bin/fr${SUFFIX_CHANGE_OWNER}`,
  GB: `https://www.ovh.co.uk/cgi-bin${SUFFIX_CHANGE_OWNER}`,
  IT: `https://www.ovh.it/cgi-bin${SUFFIX_CHANGE_OWNER}`,
  LT: `https://www.ovh.com/cgi-bin/lt${SUFFIX_CHANGE_OWNER}`,
  NL: `https://www.ovh.nl/cgi-bin${SUFFIX_CHANGE_OWNER}`,
  PL: `https://www.ovh.pl/cgi-bin${SUFFIX_CHANGE_OWNER}`,
  PT: `https://www.ovh.pt/cgi-bin${SUFFIX_CHANGE_OWNER}`,
  DEFAULT: `https://www.ovh.com/cgi-bin/fr${SUFFIX_CHANGE_OWNER}`,
};
export const VIDEO_MANAGER_LABS_URL = 'https://labs.ovhcloud.com/en/video-webhosting';
