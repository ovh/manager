import angular from 'angular';
import '@uirouter/angularjs';

import terminate from '../../../components/terminate';

import routing from './terminate-option.routing';

const moduleName = 'vpsDashboardTerminateOptionModule';

angular
  .module(moduleName, ['ui.router', terminate])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
