import angular from 'angular';

import component from './component';
import routing from './routing';

import l7RulesComponents from '../components/index';

const moduleName =
  'ovhManagerOctaviaLoadBalancerListenersListenerL7RuleEditModule';

angular
  .module(moduleName, [l7RulesComponents])
  .config(routing)
  .component('octaviaLoadBalancerListenersListenerL7RuleEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
