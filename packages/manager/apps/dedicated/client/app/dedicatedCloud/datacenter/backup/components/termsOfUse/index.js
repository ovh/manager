import angular from 'angular';

import component from './terms-of-use.component';

const moduleName = 'ovhManagerDedicatedCloudBackupTermsOfUse';

angular
  .module(moduleName, [])
  .component('dedicatedCloudDatacenterBackupTermsOfUse', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
