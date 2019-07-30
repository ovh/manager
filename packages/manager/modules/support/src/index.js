import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import angular from 'angular';
import 'oclazyload';

import { state } from './support.routing';

const moduleName = 'ovhManagerSupportLazyLoading';

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

        return import('./support.module')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngInject */ ($transitions, $translate) => {
    $transitions.onBefore({ to: `${state.name}.**` }, () => $translate.refresh());
  });

export default moduleName;
