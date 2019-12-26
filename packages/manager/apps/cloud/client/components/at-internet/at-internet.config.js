angular
  .module('managerApp')
  .config((atInternetProvider, atInternetUiRouterPluginProvider, CONFIG) => {
    const trackingEnabled = CONFIG.env === 'production';

    atInternetProvider.setEnabled(trackingEnabled);
    atInternetProvider.setDebug(!trackingEnabled);

    atInternetUiRouterPluginProvider.setTrackStateChange(true);
    atInternetUiRouterPluginProvider.addStateNameFilter((routeName) => {
      const prefix = 'cloud';
      const route = routeName ? routeName.replace(/\./g, '::') : '';
      return `${prefix}::${route}`;
    });
  })
  .run(($cookies, atInternet, TRACKING, coreConfig, OvhApiMe) => {
    const { config } = TRACKING[coreConfig.getRegion()];
    const referrerSite = $cookies.get('OrderCloud');

    if (referrerSite) {
      config.referrerSite = referrerSite;
    }

    OvhApiMe.v6()
      .get()
      .$promise.then((me) => {
        config.countryCode = me.country;
        config.currencyCode = me.currency && me.currency.code;
        config.visitorId = me.customerCode;
        atInternet.setDefaults(config);
      });
  });
