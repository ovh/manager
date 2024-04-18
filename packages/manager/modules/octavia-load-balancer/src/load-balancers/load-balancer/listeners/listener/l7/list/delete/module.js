import angular from 'angular';

import '@ovh-ux/ng-ui-router-layout';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadbalancerL7PolicyDeleteModule';

angular
  .module(moduleName, ['ngUiRouterLayout'])
  .config(routing)
  .component('octaviaLoadBalancerL7PolicyDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
