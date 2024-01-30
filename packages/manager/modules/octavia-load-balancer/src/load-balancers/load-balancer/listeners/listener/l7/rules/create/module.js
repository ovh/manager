import angular from 'angular';

import component from './component';
import routing from './routing';

import l7RulesComponents from '../components/index';

const moduleName = 'ovhManagerOctaviaLoadBalancerL7RuleCreate';

angular
  .module(moduleName, [l7RulesComponents])
  .config(routing)
  .component('octaviaLoadBalancerL7RuleCreate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
