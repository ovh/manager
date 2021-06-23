import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-at-internet-ui-router-plugin';

import provider from './provider';
import { CUSTOM_VARIABLES, USER_ID } from './config.constants';

const moduleName = 'ovhManagerAtInternetConfiguration';

const trackingEnabled = __NODE_ENV__ === 'production';

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
      coreConfigProvider,
    ) => {
      atInternetProvider.setEnabled(false);
      atInternetProvider.setDebug(!trackingEnabled);
      atInternetProvider.setRegion(coreConfigProvider.getRegion());

      atInternetUiRouterPluginProvider.setTrackStateChange(true);
      atInternetUiRouterPluginProvider.addStateNameFilter((routeName) => {
        let route = routeName || '';
        atInternetConfigurationProvider.stateRules.forEach((rule) => {
          route = route.replace(rule.pattern, rule.replacement);
        });
        route = route.replace(/\./g, '::');
        return atInternetConfigurationProvider.prefix
          ? `${atInternetConfigurationProvider.prefix}::${route}`
          : route;
      });
    },
  )
  .run(
    /* @ngInject */ ($cookies, atInternet, $rootScope) => {
      $rootScope.$on('cookie-policy:consent', () => {
        atInternet.setEnabled(trackingEnabled);
        if (trackingEnabled) {
          const cookie = $cookies.get(USER_ID);
          const tag = atInternet.getTag();
          try {
            if (cookie) {
              tag.clientSideUserId.set(cookie);
            } else {
              const value = tag.clientSideUserId.get();
              tag.clientSideUserId.store();

              const element = document.getElementById('manager-tms-iframe');

              if (element) {
                element.contentWindow.postMessage({
                  id: 'ClientUserId',
                  value,
                });
              }
            }
          } catch (e) {
            // nothing to do.
          }
        }
      });
    },
  )
  .run(
    /* @ngInject */ (
      $cookies,
      $q,
      atInternet,
      atInternetConfiguration,
      coreConfig,
    ) => {
      const referrerSite = $cookies.get('OrderCloud');
      const data = {
        ...CUSTOM_VARIABLES,
        ...atInternetConfiguration.getConfig(coreConfig.getRegion()),
        ...(referrerSite ? { referrerSite } : {}),
      };
      const me = coreConfig.getUser();
      atInternet.setDefaultsPromise(
        $q.when({
          ...data,
          countryCode: me.country,
          currencyCode: me.currency && me.currency.code,
          visitorId: me.customerCode,
        }),
      );
    },
  );

export default moduleName;
