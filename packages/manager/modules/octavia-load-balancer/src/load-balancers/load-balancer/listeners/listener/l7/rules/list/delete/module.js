import angular from 'angular';

import '@ovh-ux/ng-ui-router-layout';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadbalancerL7RuleDeleteModule';

angular
  .module(moduleName, ['ngUiRouterLayout'])
  .config(routing)
  .component('octaviaLoadBalancerL7RuleDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
