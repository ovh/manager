export const TRACKING_PREFIX = 'dedicated::dedicated-server::server';
export const TRACKING_PAGE_LABEL = `${TRACKING_PREFIX}::server::banner-info::rbx1-eol_alert`;
export const TRACKING_CONTEXT = {
  name: TRACKING_PAGE_LABEL,
  chapter1: 'dedicated',
  chapter2: 'dedicated-server',
  chapter3: 'server',
  site_level2: 'Manager-Dedicated',
  page_theme: 'DedicatedServers',
  page_category: 'banner',
  level2: 57,
};

export default {
  TRACKING_CONTEXT,
  TRACKING_PAGE_LABEL,
};
