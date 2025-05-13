import angular from 'angular';
import '@uirouter/angularjs';

import { serverTasks } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedClusterNodeTasks';

angular
  .module(moduleName, ['ui.router', serverTasks])
  .config(routing)
  .component('dedicatedClusterNodeTask', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
