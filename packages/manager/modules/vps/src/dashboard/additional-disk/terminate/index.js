import angular from 'angular';
import '@uirouter/angularjs';

import additionalDiskTerminate from '../../../components/additional-disk/terminate';

import routing from './terminate.routing';

const moduleName = 'vpsDashboardTerminateOptionModule';

angular
  .module(moduleName, ['ui.router', additionalDiskTerminate])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
