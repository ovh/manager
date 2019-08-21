import angular from 'angular';

import uiRouterAngularJs from '@uirouter/angularjs';
import oclazyload from 'oclazyload';

import { state } from './ticket.routing';

const moduleName = 'ovhManagerSupportTicketLazyLoading';

angular
  .module(moduleName, [
    oclazyload,
    uiRouterAngularJs,
  ])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('support.tickets.ticket.**', {
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./ticket.module')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
      url: state.url,
    });
  });

export default moduleName;
