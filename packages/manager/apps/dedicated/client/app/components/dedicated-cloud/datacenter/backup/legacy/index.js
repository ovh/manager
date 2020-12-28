import angular from 'angular';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterBackupLegacy';

angular
  .module(moduleName, [])
  .component('dedicatedCloudDatacenterBackupLegacy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
