import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-ovh-onboarding';
import '@ovh-ux/ui-kit/dist/css/oui.css';

import ovhManagerProductOffers from '@ovh-ux/manager-product-offers';

import './index.scss';
import './index.less';

const moduleName = 'ovhManagerWebPaasLazyLoad';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    'ngUiRouterLayout',
    'ngOvhPaymentMethod',
    'ngOvhOnboarding',
    ovhManagerProductOffers,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('web-paas.**', {
        url: '/paas/webpaas',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./web-paas.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
