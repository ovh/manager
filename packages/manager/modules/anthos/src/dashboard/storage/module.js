import angular from 'angular';
import chartjs from 'angular-chart.js';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import addStorage from './add';
import component from './component';
import removeStorage from './remove';
import routing from './routing';

const moduleName = 'ovhManagerAnthosDashboardStorage';
angular
  .module(moduleName, [
    addStorage,
    chartjs,
    removeStorage,
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('anthosStorage', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
