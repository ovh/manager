import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import host from './host';
import routing from './routing';
import storage from './storage';

const moduleName = 'ovhManagerAnthosDashboard';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    host,
    storage,
  ])
  .config(routing)
  .component('anthosDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
