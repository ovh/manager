import angular from 'angular';
import '@uirouter/angularjs';

import { serverOsInstallGabarit } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerNutanixNodeGeneralInfoServerInstallGabarit';

angular
  .module(moduleName, ['ui.router', serverOsInstallGabarit])
  .config(routing)
  .component('nutanixNodeServerInstallGabarit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
