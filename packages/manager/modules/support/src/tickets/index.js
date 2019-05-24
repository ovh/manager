import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import { state } from './tickets.routing';

const moduleName = 'ovhManagerSupportTicketsLazyLoading';

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

        return import('./tickets.module')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
