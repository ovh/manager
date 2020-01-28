import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ovhManagerCore from '@ovh-ux/manager-core';
import 'ovh-api-services';

import TRACKING from './at-internet.constant';

const moduleName = 'hubAtInternet';

angular
  .module(moduleName, [
    'ovh-api-services',
    ovhManagerCore,
    ngAtInternet,
    ngAtInternetUiRouterPlugin,
  ])
  .config(
    /* @ngInject */ (atInternetProvider, atInternetUiRouterPluginProvider) => {
      const trackingEnabled = __NODE_ENV__ === 'production';

      atInternetProvider.setEnabled(trackingEnabled);
      atInternetProvider.setDebug(!trackingEnabled);

      atInternetUiRouterPluginProvider.setTrackStateChange(true);
      atInternetUiRouterPluginProvider.addStateNameFilter((routeName) => {
        const prefix = 'hub';
        const route = routeName ? routeName.replace(/\./g, '::') : '';
        return `${prefix}::${route}`;
      });
    },
  )
  .run(
    /* @ngInject */ (atInternet, coreConfig, OvhApiMe) => {
      const config = TRACKING[coreConfig.getRegion()] || {};

      OvhApiMe.v6()
        .get()
        .$promise.then((me) => {
          config.countryCode = me.country;
          config.currencyCode = me.currency && me.currency.code;
          config.visitorId = me.customerCode;
          atInternet.setDefaults(config);
        });
    },
  );

export default moduleName;
