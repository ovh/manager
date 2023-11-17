import angular from 'angular';

import component from './component';
import routing from './routing';

import poolComponents from '../components';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsCreate';

angular
  .module(moduleName, [poolComponents])
  .config(routing)
  .component('octaviaLoadBalancerPoolsCreate', component);

export default moduleName;
