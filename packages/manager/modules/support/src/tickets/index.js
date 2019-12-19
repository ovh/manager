import angular from 'angular';

import uiRouter from '@uirouter/angularjs';
import oclazyload from 'oclazyload';

const moduleName = 'ovhManagerSupportTicketsLazyLoading';

angular
  .module(moduleName, [
    oclazyload,
    uiRouter,
  ])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('support.tickets.**', {
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./tickets.module')
          .then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
      url: '/tickets',
    });
  });

export default moduleName;
