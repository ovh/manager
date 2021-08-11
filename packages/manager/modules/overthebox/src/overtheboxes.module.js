import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-api-services';

import '@ovh-ux/manager-core';

import component from './overtheboxes.component';
import routing from './overtheboxes.routing';

const moduleName = 'ovhManagerOverTheBox';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    'ovh-api-services',
  ])
  .config(routing)
  .component('ovhManagerOverTheBoxes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
