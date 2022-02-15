import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './software-update.routing';
import component from './software-update.component';

const moduleName = 'ovhManagerAnthosDashboardSoftwareUpdate';

angular
  .module(moduleName, ['ui.router', 'oui', 'pascalprecht.translate'])
  .config(routing)
  .component('anthosDashboardSoftwareUpdate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
