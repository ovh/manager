import angular from 'angular';

import component from './component';
import routing from './routing';

import poolComponents from '../components';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsEdit';

angular
  .module(moduleName, [poolComponents])
  .config(routing)
  .component('octaviaLoadBalancerPoolsEdit', component);

export default moduleName;
