import angular from 'angular';

import component from './component';
import routing from './routing';

import list from './list';
import detail from './detail';
import create from './create';
import edit from './edit';
import deletion from './detail/delete';

const moduleName = 'ovhManagerOctaviaLoadBalancerPools';

angular
  .module(moduleName, [list, detail, create, edit, deletion])
  .config(routing)
  .component('octaviaLoadBalancerPools', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
