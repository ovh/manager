import angular from 'angular';
import '@uirouter/angularjs';

import { serverTasks } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedServerTasks';

angular
  .module(moduleName, ['ui.router', serverTasks])
  .config(routing)
  .component('dedicatedServerTask', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
