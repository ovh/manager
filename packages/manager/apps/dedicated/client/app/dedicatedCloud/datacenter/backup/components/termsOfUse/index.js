import angular from 'angular';

import component from './terms-of-use.component';

const moduleName = 'ovhManagerDedicatedCloudBackupTermsOfUse';

angular
  .module(moduleName, [])
  .component('ovhManagerDedicatedCloudBackupTermsOfUse', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
