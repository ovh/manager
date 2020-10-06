import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-ovh-onboarding';
import '@ovh-ux/ui-kit/dist/css/oui.css';

import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ovhManagerProductOffers from '@ovh-ux/manager-product-offers';

import './index.scss';

const moduleName = 'ovhManagerPlatformShLazyLoad';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    'ngUiRouterLayout',
    'ngOvhPaymentMethod',
    'ngOvhOnboarding',
    ngOvhCloudUniverseComponents,
    ovhManagerProductOffers,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('platform-sh.**', {
        url: '/pass/platform-sh',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./platform-sh.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
