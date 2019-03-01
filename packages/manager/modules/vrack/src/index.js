import angular from 'angular';
import 'angular-ui-bootstrap';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-ui-kit/dist/oui.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';
import '@ovh-ux/manager-cloud-styles';

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
