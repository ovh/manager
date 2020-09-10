import angular from 'angular';
import 'angular-translate';

import component from './dedicatedCloud-user-disable.component';

const moduleName = 'ovhManagerDedicatedCloudUserDisable';

angular
  .module(moduleName, [])
  .component('dedicatedCloudUserDisable', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
