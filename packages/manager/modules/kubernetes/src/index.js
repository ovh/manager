import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

import './index.less';
import './index.scss';

const moduleName = 'ovhManagerKubernetes';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('kube.**', {
      url: '/kube/:serviceName',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./details/index')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
