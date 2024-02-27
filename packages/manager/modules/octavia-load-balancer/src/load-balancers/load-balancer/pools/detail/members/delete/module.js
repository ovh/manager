import angular from 'angular';

import '@ovh-ux/ng-ui-router-layout';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailMembersDelete';

angular
  .module(moduleName, ['ngUiRouterLayout'])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailMembersDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
