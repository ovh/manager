import angular from 'angular';
import '@uirouter/angularjs';

import { serverOsInstallOvh } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedServerInstallOvh';

angular
  .module(moduleName, ['ui.router', serverOsInstallOvh])
  .config(routing)
  .component('dedicatedServerInstallOvh', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
