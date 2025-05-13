import angular from 'angular';
import '@uirouter/angularjs';

import { serverNetboot } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedClusterNodeNetboot';

angular
  .module(moduleName, ['ui.router', serverNetboot])
  .config(routing)
  .component('dedicatedClusterNodeNetboot', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
