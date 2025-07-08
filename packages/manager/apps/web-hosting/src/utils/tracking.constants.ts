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
export const CANCEL = 'cancel';
export const CONFIRM = 'confirm';
export const BACK_PREVIOUS_PAGE = 'back_previous-page';

export const ONBOARDING = 'onboarding';
export const ORDER_CTA = 'order_website';
export const EXPORT_CSV = 'export_csv';
export const DATAGRID_LINK = 'details_';
export const WEBSITE = 'website';
export const STATISTICS = 'statistics';
export const DIAGNOSTIC = 'diagnostic';
export const DASHBOARD = 'dashboard';
export const SSL = 'ssl';

export const GUIDE_GETTING_STARTED = 'getting-started-guide';
export const GUIDE_PUBLISHING = 'publishing-guide';
export const GUIDE_EDIT_DNS_ZONE = 'edit-dns-zone-guide';

export const GO_TO = (link: string) => `go-to-${link}_${WEBSITE}`;
