import angular from 'angular';

import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ovh-api-wrappers';
import '@ovh-ux/ng-ovh-swimming-poll';
import managerCore from '@ovh-ux/manager-core';
import uiRouterAngularJs from '@uirouter/angularjs';
import oclazyload from 'oclazyload';

import { state } from './support.routing';

const moduleName = 'ovhManagerSupportLazyLoading';

angular
  .module(moduleName, [
    managerCore,
    ngAtInternet,
    oclazyload,
    'ovh-api-services',
    uiRouterAngularJs,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('support.**', {
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./support.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
        url: state.url,
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($transitions, $translate) => {
      $transitions.onBefore({ to: 'support.**' }, () => $translate.refresh());
    },
  );

export default moduleName;
