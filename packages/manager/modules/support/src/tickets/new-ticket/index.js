import angular from 'angular';

import uiRouter from '@uirouter/angularjs';
import oclazyload from 'oclazyload';

const moduleName = 'ovhManagerSupportTicketsNewLazyLoading';

angular
  .module(moduleName, [
    oclazyload,
    uiRouter,
  ])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('support.tickets.new.**', {
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./new-ticket.module')
          .then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
      url: '/new',
    });
  });

export default moduleName;
