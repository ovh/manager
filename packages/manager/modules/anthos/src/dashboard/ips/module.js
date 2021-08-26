import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

import assignPrivateIp from './assign-private-ip';
import removePrivateIp from './remove-private-ip';

const moduleName = 'ovhManagerAnthosDashboardIPs';
angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    assignPrivateIp,
    removePrivateIp,
  ])
  .component('anthosIPs', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
