import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './monitoring.component';
import routing from './monitoring.routing';

const moduleName = 'ovhManagerDedicatedServerMonitoring';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('dedicatedServerMonitoring', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
