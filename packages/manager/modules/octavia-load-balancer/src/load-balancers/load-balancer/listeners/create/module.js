import angular from 'angular';

import component from './component';
import routing from './routing';

import listenerComponents from '../components';

const moduleName = 'ovhManagerOctaviaLoadBalancerListenersCreate';

angular
  .module(moduleName, [listenerComponents])
  .config(routing)
  .component('octaviaLoadBalancerListenersCreate', component);

export default moduleName;
