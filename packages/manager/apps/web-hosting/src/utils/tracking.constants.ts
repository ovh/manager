export const LEVEL2 = {
  EU: {
    config: {
      level2: '84',
    },
  },
  CA: {
    config: {
      level2: '84',
    },
  },
  US: {
    config: {
      level2: '84',
    },
  },
};

export const UNIVERSE = 'Hosting';
export const SUB_UNIVERSE = 'website';

export const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: SUB_UNIVERSE,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};

// COMMON/MISC
export const BACK_PREVIOUS_PAGE = 'back_previous-page';
export const CANCEL = 'cancel';
export const CONFIRM = 'confirm';
export const ONBOARDING = 'onboarding';
export const EXPORT_CSV = 'export_csv';
export const DATAGRID_LINK = 'details_';
export const GENERAL_INFORMATION = 'general-information';
export const TASKS = 'tasks';
export const IMPORT = 'import';
export const CREATE = 'create';
export const DELETE = 'delete';
export const STATISTICS = 'statistics';
export const DIAGNOSTIC = 'diagnostic';
export const DASHBOARD = 'dashboard';
export const GUIDE_EDIT_DNS_ZONE = 'edit-dns-zone-guide';
export const GUIDE_GETTING_STARTED = 'getting-started-guide';
export const GUIDE_PUBLISHING = 'publishing-guide';
export const MULTISITE = 'multisite';
export const EDIT_NAME = 'edit-name';

// domain
export const ADD_DOMAIN = 'add-domain';
export const ADD_WEBSITE = 'add-website';
export const DETACHE_DOMAIN = 'detache-domain';
export const MODIFY_DOMAIN = 'modify-domain';
export const ORDER_DOMAIN = 'order-domain';

// git
export const ASSOCIATE_GIT = 'associate-git';
export const CONFIGURE_GIT = 'configure-git';
export const DELETE_GIT = 'delete-git';
export const DEPLOYE_GIT = 'deploye-git';
export const LAST_DEPLOYEMENT_GIT = 'last-deployment-git';

// cdn
export const MODIFY_CDN = 'modify-cdn';
export const PURGE_CDN = 'purge-cdn';
export const ADVANCED_FLUSH_CDN = 'advanced-flush-cdn';
export const CDN_CACHE_RULE = 'cdn-cache-rule';
export const CDN_EDIT_URLS = 'cdn-edit-urls';
export const CDN_CORS_RESOURCE_SHARING = 'cdn-cors-resource-sharing';
export const CDN_CONFIRMATION = 'cdn-confirmation';

// module
export const ADD_MODULE = 'add-module';
export const DELETE_MODULE = 'delete-module';

// site
export const DELETE_SITE = 'delete-site';

// ssl
export const DISABLE_SSL = 'disable-ssl';
export const IMPORT_SSL = 'import-ssl';
export const ORDER_SECTIGO = 'order-sectigo';
export const SAN_SSL = 'san-ssl';
export const SSL = 'ssl';

// website
export const ORDER_CTA = 'order_website';
export const WEBSITE = 'website';

// task
export const TASK = 'task';

// local seo
export const LOCAL_SEO = 'local-seo';
export const REMOVE_SEO_SUBSCIPTION = 'remove-seo-subscription';

// managed wordpress

export const WORDPRESS_MANAGED = 'managed-wordpress';
export const WORDPRESS_MANAGED_SERVICE = 'managed-wordpress_service';

// video center
export const VIDEO_CENTER = 'video-center';
export const VIDEO_CENTER_DASHBOARD = 'video-center-dashboard';
export const VIDEO_CENTER_FREEMIUM_DASHBOARD = 'video-center-freemium-dashboard';
export const VIDEO_CENTER_ONBOARDING = 'video-center-onboarding';
export const VIDEO_CENTER_ORDER = 'video-center-order';
export const VIDEO_CENTER_ACTIVATE = 'video-center-activate';

export const GO_TO = (link: string) => `go-to-${link}_${WEBSITE}`;
