import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

import component from './freefaxes.component';
import routing from './freefaxes.routing';
import freefax from './freefax';

const moduleName = 'ovhManagerFreeFaxes';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    freefax,
  ])
  .config(routing)
  .component('ovhManagerFreefaxes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
