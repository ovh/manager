import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './datacenter-configuration.component';

const moduleName = 'ovhCloudConnectDatacenterConfigurationInfo';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate'])
  .component('ovhCloudConnectDatacenterConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
