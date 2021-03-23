import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-at-internet-ui-router-plugin';

import { Environment } from '@ovh-ux/manager-config';

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
    ) => {
      atInternetProvider.setEnabled(trackingEnabled);
      atInternetProvider.setDebug(!trackingEnabled);

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
    /* @ngInject */ ($cookies, atInternet) => {
      const cookie = $cookies.get(USER_ID);
      const tag = atInternet.getTag();
      if (trackingEnabled) {
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
    },
  )
  .run(
    /* @ngInject */ ($cookies, $http, atInternet, atInternetConfiguration) => {
      const referrerSite = $cookies.get('OrderCloud');
      const data = {
        ...CUSTOM_VARIABLES,
        ...atInternetConfiguration.getConfig(Environment.getRegion()),
        ...(referrerSite ? { referrerSite } : {}),
      };

      atInternet.setDefaultsPromise(
        $http
          .get('/me')
          .then(({ data: me }) => me)
          .catch(() => {})
          .then((me) => ({
            ...data,
            countryCode: me.country,
            currencyCode: me.currency && me.currency.code,
            visitorId: me.customerCode,
          })),
      );
    },
  );

export default moduleName;
