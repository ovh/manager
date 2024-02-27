import angular from 'angular';
import '@ovh-ux/ng-ui-router-layout';

import component from './edit-name.component';
import routing from './edit-name.routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerEditNameModule';

angular
  .module(moduleName, ['ngUiRouterLayout'])
  .config(routing)
  .component('octaviaLoadBalancerEditName', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
