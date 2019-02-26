import angular from 'angular';
import 'angular-ui-bootstrap';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'oclazyload';

import vrackAdd from './add';

const moduleName = 'ovhManagerVrack';

angular.module(moduleName, [
  'ui.router',
  'ui.bootstrap',
  'oc.lazyLoad',
  'ovhManagerCore',
  'ngOvhCloudUniverseComponents',
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
