import angular from 'angular';
import '@uirouter/angularjs';

import { serverInterventions } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedClusterNodeInterventions';

angular
  .module(moduleName, ['ui.router', serverInterventions])
  .config(routing)
  .component('dedicatedClusterNodeInterventions', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
