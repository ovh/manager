const APP_TRACKING_PREFIX = 'PublicCloud::databases_analytics::databases';
export const PCI_LEVEL2 = '86';
export const TRACKING = {
  onboarding: {
    page: () => `${APP_TRACKING_PREFIX}::databases::onboarding`,
    createDatabaseClick: () =>
      `${APP_TRACKING_PREFIX}::page::button::create_databases`,
    guideClick: (guideName: string) =>
      `${APP_TRACKING_PREFIX}::page::tile-tutorial::go-to-${guideName}`,
  },
};
