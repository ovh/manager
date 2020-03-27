import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerMetrics';

angular
  .module(moduleName, ['ovhManagerCore', 'pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('Metrics', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
