export const LOGO_FILE_FORMATS = 'image/png,image/jpeg,image/jpg';
export const LOGO_BY_DEFAULT =
  'https://softphone-production.s3.gra.io.cloud.ovh.net/public/Softphone_app_icon_512x512.png';
export const MAX_SIZE_LOGO_FILE = 1000000;
export const MOBILE_OS = {
  windows: 'windows',
  android: 'android',
  ios: 'ios',
  macos: 'macos',
};

export const DOWNLOAD_URL = 'https://download.softcall.app/apps/prod/';

const TRACKING_PREFIX = 'telecom::telephony::{{serviceType}}::';

const TRACKING_CATEGORY_AND_THEME = {
  page_category: 'dashboard',
  page_theme: 'Telecom',
};

const TRACKING_SOFTPHONE_DASHBOARD_SUFFIX =
  '{{serviceType}}::dashboard::softphone';

export const SOFTPHONE_TRACKING = {
  PAGE: {
    name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
    page: {
      name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
    },
    ...TRACKING_CATEGORY_AND_THEME,
  },
  DOWNLOAD: {
    STORE: {
      name: `${TRACKING_PREFIX}tile::button::download_softphone-{{storeName}}`,
      page: {
        name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
    LINK: {
      name: `${TRACKING_PREFIX}tile::button::copy_download-link::softphone`,
      page: {
        name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
  },
  DEVICE_MANAGEMENT: {
    NEW_TOKEN: {
      name: `${TRACKING_PREFIX}tile::button::get_provisioning-token::softphone`,
      page: {
        name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
    GUIDE: {
      name: `${TRACKING_PREFIX}tile::external-link::go-to-softphone-guide`,
      page: {
        name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
    DELETE_ALL: {
      name: `${TRACKING_PREFIX}tile::button::disable_all-devices::softphone`,
      page: {
        name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
    DELETE: {
      name: `${TRACKING_PREFIX}datagrid::button::delete_device::softphone`,
      page: {
        name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
    DATAGRID: {
      name: `${TRACKING_PREFIX}{{serviceType}}::dashboard::softphone::device-listing::{{deviceAction}}`,
      page: {
        name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
    REFRESH: {
      name: `${TRACKING_PREFIX}datagrid::button::delete_device::softphone`,
      page: {
        name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
  },
  REMOVE_DEVICE: {
    PAGE: {
      name: `${TRACKING_PREFIX}{{serviceType}}::pop-up::delete_device::softphone`,
      page: {
        name: `${TRACKING_PREFIX}pop-up::delete_device::softphone`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
      page_category: 'pop-up',
    },
    REMOVE: {
      name: `${TRACKING_PREFIX}pop-up::button::delete_device_softphone::confirm`,
      page: {
        name: `${TRACKING_PREFIX}pop-up::delete_device::softphone`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
      page_category: 'pop-up',
    },
  },
  ADD_DEVICE: {
    PAGE: {
      name: `${TRACKING_PREFIX}{{serviceType}}::pop-up::get_provisioning-token::softphone`,
      page: {
        name: `${TRACKING_PREFIX}pop-up::get_provisioning-token::softphone`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
      page_category: 'pop-up',
    },
    TOKEN: {
      name: `${TRACKING_PREFIX}pop-up::button::get_provisioning-token_softphone::confirm`,
      page: {
        name: `${TRACKING_PREFIX}pop-up::get_provisioning-token::softphone`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
      page_category: 'pop-up',
    },
  },
  LOGO_MANAGEMENT: {
    BANNER: {
      name: `${TRACKING_PREFIX}{{serviceType}}::banner-{{bannerType}}::upload-softphone-logo_{{returnType}}`,
      page: {
        name: `${TRACKING_PREFIX}{{serviceType}}::banner-{{bannerType}}::upload-softphone-logo_{{returnType}}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
      page_category: 'banner',
    },
    DELETE: {
      name: `${TRACKING_PREFIX}page::button::delete_logo::softphone`,
      page: {
        name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
  },
  THEME_MANAGEMENT: {
    APPLY: {
      name: `${TRACKING_PREFIX}page::button::create_theme::softphone`,
      page: {
        name: `${TRACKING_PREFIX}${TRACKING_SOFTPHONE_DASHBOARD_SUFFIX}`,
      },
      ...TRACKING_CATEGORY_AND_THEME,
    },
  },
};

export const GUIDE_URL =
  'https://help.ovhcloud.com/csm/fr-documentation-web-cloud-phone-and-fax-voip?id=kb_browse_cat&kb_id=e17b4f25551974502d4c6e78b7421955&kb_category=3f445d55f49801102d4ca4d466a7fd31';

export default {
  MOBILE_OS,
  MAX_SIZE_LOGO_FILE,
  LOGO_FILE_FORMATS,
  SOFTPHONE_TRACKING,
  DOWNLOAD_URL,
  LOGO_BY_DEFAULT,
};
