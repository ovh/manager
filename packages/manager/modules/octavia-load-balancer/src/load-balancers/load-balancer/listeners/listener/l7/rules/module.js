import angular from 'angular';

import component from './component';
import routing from './routing';

import list from './list';
import create from './create';
import deletion from './list/delete';
import edit from './edit';

const moduleName = 'ovhManagerOctaviaLoadBalancerL7Rules';

angular
  .module(moduleName, [list, create, deletion, edit])
  .config(routing)
  .component('octaviaLoadBalancerL7Rules', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
