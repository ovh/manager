import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import vrackAdd from './add';

const moduleName = 'ovhManagerVrack';

angular.module(moduleName, [
  'ui.router',
  'oc.lazyLoad',
  'ovhManagerCore',
  vrackAdd,
]).config(/* @ngInject */($stateProvider) => {
  $stateProvider.state('vrack.**', {
    url: '/vrack/:serviceName',
    lazyLoad: ($transition$) => {
      const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

      return import('./vrack.component')
        .then(mod => $ocLazyLoad.inject(mod.default || mod));
    },
  });
});

export default moduleName;
