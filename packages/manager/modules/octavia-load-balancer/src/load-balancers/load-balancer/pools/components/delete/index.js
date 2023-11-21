import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerPoolsComponentsDelete';

angular
  .module(moduleName, [])
  .component('octaviaLoadBalancerPoolsDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
