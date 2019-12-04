import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth'; // peerDep of manager-core

import TRACKING from './at-internet.constant';

const moduleName = 'ovhSignUpAtInternet';

angular
  .module(moduleName, [
    ovhManagerCore,
    ngAtInternet,
    ngOvhSsoAuth,
  ])
  .config(/* @ngInject */ (atInternetProvider) => {
    const trackingEnabled = __NODE_ENV__ === 'production';

    atInternetProvider.setEnabled(trackingEnabled);
    atInternetProvider.setDebug(!trackingEnabled);
  })
  .run(/* @ngInject */ (atInternet, coreConfig, ssoAuthentication) => {
    const config = TRACKING[coreConfig.getRegion()] || {};

    ssoAuthentication
      .getSsoAuthPendingPromise()
      .then(() => ssoAuthentication.user)
      .then((me) => {
        config.countryCode = me.country;
        config.currencyCode = me.currency && me.currency.code;
        config.visitorId = me.customerCode;
        atInternet.setDefaults(config);
      });
  });

export default moduleName;
