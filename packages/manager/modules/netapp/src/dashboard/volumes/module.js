import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

import deleteModule from './delete';

const moduleName = 'ovhManagerNetAppVolumes';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    deleteModule,
  ])
  .config(routing)
  .component('ovhManagerNetAppVolumes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
