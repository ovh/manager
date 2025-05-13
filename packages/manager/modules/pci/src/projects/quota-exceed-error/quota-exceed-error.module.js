import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import routing from './quota-exceed-error.routing';

const moduleName = 'ovhManagerPciProjectsQuotaExceedError';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate'])
  .config(routing);

export default moduleName;
