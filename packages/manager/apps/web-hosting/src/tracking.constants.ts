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
export const UNIVERSE = 'WebCloud';
export const SUB_UNIVERSE = 'Web';
export const APP_NAME = 'web-hosting';

export const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};

// COMMON/MISC
export const CANCEL = 'cancel';
export const CONFIRM = 'confirm';
export const BACK_PREVIOUS_PAGE = 'back_previous-page';
export const TO_BE_DEFINED = 'to-be-defined';

export const ONBOARDING = 'onboarding';
export const ONBOARDING_ORDER_CTA = 'onboarding_order_cta';
export const DASHBOARD = 'dashboard';
export const WEBSITES = 'websites';
export const SSL = 'ssl';
export const GENERAL_INFORMATIONS = 'general_informations';

export const GUIDE_GETTING_STARTED = 'getting-started-guide';
export const GUIDE_PUBLISHING = 'publishing-guide';
export const GUIDE_EDIT_DNS_ZONE = 'edit-dns-zone-guide';

export const GO_TO = (link: string) => `go-to-${link}`;
