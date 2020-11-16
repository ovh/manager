import angular from 'angular';
import 'angular-translate';

import component from './dedicatedCloud-user-enable.component';

const moduleName = 'ovhManagerDedicatedCloudUserEnable';

angular
  .module(moduleName, [])
  .component('dedicatedCloudUserEnable', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
