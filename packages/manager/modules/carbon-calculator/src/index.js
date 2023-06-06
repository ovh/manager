import angular from 'angular';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'oclazyload';

import './index.scss';

const moduleName = 'ovhManagerCarbonCalculatorLazyLoading';

angular
  .module(moduleName, ['ngUiRouterBreadcrumb', 'ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.**', {
        url: '/carbon',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
