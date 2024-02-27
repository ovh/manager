import angular from 'angular';

import '@ovh-ux/ng-ui-router-layout';

import component from './component';
import routing from './routing';
import deleteComponents from '../../components';

const moduleName = 'ovhManagerOctaviaLoadbalancerPoolsListDeleteModule';

angular
  .module(moduleName, ['ngUiRouterLayout', deleteComponents])
  .config(routing)
  .component('octaviaLoadBalancerPoolsListDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
