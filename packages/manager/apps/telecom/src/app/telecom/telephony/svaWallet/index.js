import angular from 'angular';
import '@ovh-ux/ng-ovh-feature-flipping';
import '@uirouter/angularjs';
import 'oclazyload';

import service from './sva-wallet.service';
import profileTile from './profileTile';
import statusBanner from './statusBanner';

const moduleName = 'ovhManagerTelecomTelephonySvaWalletLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    'ngOvhFeatureFlipping',
    profileTile,
    statusBanner,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('telecom.telephony.billingAccount.svaWallet.**', {
        url: '/sva-wallet',
        lazyLoad: ($transition$) => {
          return import('./sva-wallet.module').then((mod) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
            return $ocLazyLoad.inject(mod.default || mod);
          });
        },
      });
    },
  )
  // the service should stay available
  .service('TelephonySvaWalletService', service);

export default moduleName;
