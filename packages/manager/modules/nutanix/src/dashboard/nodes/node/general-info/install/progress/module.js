import angular from 'angular';
import '@uirouter/angularjs';

import { serverOsInstallProgress } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerNutanixNodeGeneralInfoServerInstallProgress';

angular
  .module(moduleName, ['ui.router', serverOsInstallProgress])
  .config(routing)
  .component('nutanixNodeServerInstallProgress', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
