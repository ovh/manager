import angular from 'angular';

import '@ovh-ux/ng-ui-router-layout';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadbalancerPoolDeleteModule';

angular
  .module(moduleName, ['ngUiRouterLayout'])
  .config(routing)
  .component('octaviaLoadBalancerPoolDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
