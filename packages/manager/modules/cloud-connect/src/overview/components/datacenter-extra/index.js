import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './datacenter-extra.component';

const moduleName = 'ovhCloudConnectDatacenterExtraInfo';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate'])
  .component('ovhCloudConnectDatacenterExtra', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
