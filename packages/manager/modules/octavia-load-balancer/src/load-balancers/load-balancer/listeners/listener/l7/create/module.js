import angular from 'angular';

import component from './component';
import routing from './routing';

import l7Components from '../components/index';

const moduleName = 'ovhManagerOctaviaLoadBalancerL7Create';

angular
  .module(moduleName, [l7Components])
  .config(routing)
  .component('octaviaLoadBalancerL7Create', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
