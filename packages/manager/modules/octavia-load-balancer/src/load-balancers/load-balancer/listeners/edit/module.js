import angular from 'angular';

import component from './component';
import routing from './routing';

import listenerComponents from '../components';

const moduleName = 'ovhManagerOctaviaLoadBalancerListenersEdit';

angular
  .module(moduleName, [listenerComponents])
  .config(routing)
  .component('octaviaLoadBalancerListenersEdit', component);

export default moduleName;
