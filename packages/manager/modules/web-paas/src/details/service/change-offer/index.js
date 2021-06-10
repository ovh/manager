import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';

const moduleName = 'ovhManagerWebPaasDetailsServiceChangeOfferLazyloading';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('web-paas.dashboard.service.change-offer.**', {
        url: '/change-offer',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./change-offer.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
