import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-at-internet-ui-router-plugin';

import provider from './provider';
import { CUSTOM_VARIABLES } from './config.constants';

const moduleName = 'ovhManagerAtInternetConfiguration';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngAtInternetUiRouterPlugin',
    'ovhManagerCore',
  ])
  .provider('atInternetConfiguration', provider)
  .config(
    /* @ngInject */ (
      atInternetConfigurationProvider,
      atInternetProvider,
      atInternetUiRouterPluginProvider,
    ) => {
      const trackingEnabled = __NODE_ENV__ === 'production';

      atInternetProvider.setEnabled(trackingEnabled);
      atInternetProvider.setDebug(!trackingEnabled);

      atInternetUiRouterPluginProvider.setTrackStateChange(true);
      atInternetUiRouterPluginProvider.addStateNameFilter((routeName) => {
        let route = routeName || '';
        atInternetConfigurationProvider.stateRules.forEach((rule) => {
          route.replace(rule.pattern, rule.replacement);
        });
        route = routeName.replace(/\./g, '::');
        return atInternetConfigurationProvider.prefix
          ? `${atInternetConfigurationProvider.prefix}::${route}`
          : route;
      });
    },
  )
  .run(
    /* @ngInject */ (
      $http,
      atInternet,
      atInternetConfiguration,
      coreConfig,
    ) => {
      $http.get('/me').then(({ data: me }) => {
        atInternet.setDefaults({
          ...CUSTOM_VARIABLES,
          ...atInternetConfiguration.getConfig(coreConfig.getRegion()),
          countryCode: me.country,
          currencyCode: me.currency && me.currency.code,
          visitorId: me.customerCode,
        });
      });
    },
  );

export default moduleName;
