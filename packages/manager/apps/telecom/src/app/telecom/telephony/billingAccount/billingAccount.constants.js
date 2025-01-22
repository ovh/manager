const TRACKING_PREFIX = 'telecom::telephony::billing-group::';

const TRACKING_CATEGORY_AND_THEME = {
  page_category: 'dashboard',
  page_theme: 'Telecom',
};

export const BILLING_ACCOUNT_TRACKING = {
  PAGE: {
    name: `${TRACKING_PREFIX}billing-group::dashboard`,
    page: {
      name: `${TRACKING_PREFIX}billing-group::dashboard`,
    },
    ...TRACKING_CATEGORY_AND_THEME,
  },
  LOGO_MANAGEMENT: {
    BANNER: {
      name: `${TRACKING_PREFIX}billing-group::banner-{{bannerType}}::upload-softphone-logo_{{returnType}}`,
      page: {
        name: `${TRACKING_PREFIX}billing-group::banner-{{bannerType}}::upload-softphone-logo_{{returnType}}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
      page_category: 'banner',
    },
    DELETE: {
      name: `${TRACKING_PREFIX}page::button::delete_logo::softphone`,
      page: {
        name: `${TRACKING_PREFIX}billing-group::dashboard`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
  },
  THEME_MANAGEMENT: {
    APPLY: {
      name: `${TRACKING_PREFIX}page::button::create_theme::softphone`,
      page: {
        name: `${TRACKING_PREFIX}billing-group::dashboard`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
  },
};

export default {
  BILLING_ACCOUNT_TRACKING,
};
