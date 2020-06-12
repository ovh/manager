import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ng-ovh-payment-method';

import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ovhManagerCore from '@ovh-ux/manager-core';
import 'ovh-api-services';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import './index.scss';

const moduleName = 'enterpriseCloudDatabase';

angular
  .module(moduleName, [
    'ngUiRouterLayout',
    'ngOvhPaymentMethod',
    'oc.lazyLoad',
    'ui.router',
    'ovh-api-services',
    ngOvhCloudUniverseComponents,
    ovhManagerCore,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('enterprise-cloud-database.**', {
        url: '/enterprise-cloud-database',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./enterprise-cloud-database.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
