import angular from 'angular';
import '@ovh-ux/ng-ui-router-layout';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailMembersCreate';

angular
  .module(moduleName, ['ngUiRouterLayout'])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailMembersCreate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
