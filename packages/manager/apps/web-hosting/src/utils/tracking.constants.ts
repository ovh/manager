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

// domain
export const ADD_DOMAIN = 'add-domain';
export const ORDER_DOMAIN = 'order-domain';

// module
export const ADD_MODULE = 'add-module';
export const DELETE_MODULE = 'delete-module';

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

// managed wordpress

export const WORDPRESS_MANAGED = 'managed-wordpress';
export const WORDPRESS_MANAGED_SERVICE = 'managed-wordpress_service';


export const GO_TO = (link: string) => `go-to-${link}_${WEBSITE}`;
