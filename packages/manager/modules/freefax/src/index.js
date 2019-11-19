import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

import freefax from './freefax';

const moduleName = 'ovhManagerFreeFaxes';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    freefax,
  ]);
// .config(/* @ngInject */($stateProvider) => {
//   $stateProvider.state('freefax.**', {
//     url: '/freefax/:serviceName',
//     lazyLoad: ($transition$) => {
//       const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

//       return import('./freefax.component')
//         .then(mod => $ocLazyLoad.inject(mod.default || mod));
//     },
//   });
// });

export default moduleName;
