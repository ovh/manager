import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import { state } from './ticket.routing';

const moduleName = 'ovhManagerSupportTicketLazyLoading';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'oc.lazyLoad',
    'ui.router',
  ])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(`${state.name}.**`, {
      url: state.url,
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./ticket.module')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
