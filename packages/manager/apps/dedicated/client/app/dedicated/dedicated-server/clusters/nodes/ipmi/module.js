import angular from 'angular';
import '@uirouter/angularjs';

import { serverIpmi } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedClusterNodeIpmi';

angular
  .module(moduleName, ['ui.router', serverIpmi])
  .config(routing)
  .component('dedicatedClusterNodeIpmi', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
