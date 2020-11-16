import angular from 'angular';
import 'angular-translate';

import component from './dedicatedCloud-user-delete.component';

const moduleName = 'ovhManagerDedicatedCloudUserDelete';

angular
  .module(moduleName, [])
  .component('dedicatedCloudUserDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
