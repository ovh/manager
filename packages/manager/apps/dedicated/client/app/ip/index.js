import angular from 'angular';
import ipFeatureAvailability from './ip-feature-availability';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedIpLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.ip.**', {
        url: '/ip',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import(
            /* webpackChunkName: "ip" */ './ip.module'
          ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      });
    },
  )
  .config(
    /* @ngInject */ ($urlRouterProvider) => {
      $urlRouterProvider.when(/^\/configuration\/ip/, () => {
        window.location.href = window.location.href.replace(
          '/configuration',
          '',
        );
      });
    },
  )
  .service('ipFeatureAvailability', ipFeatureAvailability);

export default moduleName;
