import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import routing from './routing';
import node from './node';
import component from './component';

const moduleName = 'ovhManagerNutanixNodes';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    node,
  ])
  .config(routing)
  .component('nutanixNodes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
