import angular from 'angular';

import '@ovh-ux/manager-core';
import { isTopLevelApplication } from '@ovh-ux/manager-config';

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
      atInternetUiRouterPluginProvider,
    ) => {
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
    /* @ngInject */ ($rootScope, atInternet) => {
      if (!isTopLevelApplication()) return;
      $rootScope.$on(
        'cookie-policy:decline',
        async (_, { fromModal } = { fromModal: false }) => {
          if (fromModal) {
            await atInternet.onUserConsentFromModal(false);
          } else {
            await atInternet.init(false);
          }
        },
      );

      $rootScope.$on(
        'cookie-policy:consent',
        async (_, { fromModal } = { fromModal: false }) => {
          if (fromModal) {
            await atInternet.onUserConsentFromModal(true);
          } else {
            await atInternet.init(true);
          }
        },
      );
    },
  )
  .run(
    /* @ngInject */ (
      $cookies,
      atInternet,
      atInternetConfiguration,
      coreConfig,
    ) => {
      if (!atInternetConfiguration.skipInit) {
        const referrerSite = $cookies.get('OrderCloud');
        const data = {
          ...CUSTOM_VARIABLES,
          ...atInternetConfiguration.getConfig(coreConfig.getRegion()),
          ...(referrerSite ? { referrerSite } : {}),
        };
        const me = coreConfig.getUser();
        const atInternetDefaultConfig = {
          ...data,
          countryCode: me.country,
          currencyCode: me.currency && me.currency.code,
          legalform: me.legalform,
          subsidiary: me.ovhSubsidiary,
          visitorId: me.customerCode,
        };
        atInternet.setRegion(coreConfig.getRegion());
        atInternet.setDefaults(atInternetDefaultConfig);
      }
    },
  );

export default moduleName;
