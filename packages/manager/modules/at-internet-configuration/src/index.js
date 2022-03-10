import angular from 'angular';

import '@ovh-ux/manager-core';
import ngShellTracking from '@ovh-ux/ng-shell-tracking';
import '@ovh-ux/ng-at-internet-ui-router-plugin';

import provider from './provider';
import { CUSTOM_VARIABLES, USER_ID } from './config.constants';

const moduleName = 'ovhManagerAtInternetConfiguration';

const trackingEnabled = __NODE_ENV__ === 'production';

angular
  .module(moduleName, [
    ngShellTracking,
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
  .config(
    /* @ngInject */ (atInternet, atInternetProvider) => {
      atInternet.setTrackingPlugin(atInternetProvider.getTrackingPlugin());
    },
  )
  .run(
    /* @ngInject */ ($cookies, $rootScope, $window, atInternet) => {
      $rootScope.$on(
        'cookie-policy:decline',
        (event, { fromModal } = { fromModal: false }) => {
          // initialize atInternet without cookies (enabled === false) and empty tracking queue
          atInternet.setEnabled(trackingEnabled);
          atInternet.clearTrackQueue();
          if ($window.ATInternet) {
            $window.ATInternet.Utils.consentReceived(false); // disable cookie creation
            atInternet.initTag();
            if (fromModal) {
              atInternet.trackClick({
                type: 'action',
                name: 'cookie-banner-manager::decline',
              });
            }
          }
          // disable atInternet
          atInternet.setEnabled(false);
        },
      );

      $rootScope.$on(
        'cookie-policy:consent',
        (event, { fromModal } = { fromModal: false }) => {
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
              if (fromModal) {
                atInternet.trackClick({
                  type: 'action',
                  name: 'cookie-banner-manager::accept',
                });
              }
            } catch (e) {
              // nothing to do.
            }
          }
        },
      );
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
