import angular from 'angular';
import 'angular-translate';

import component from './dedicatedCloud-user-edit.component';

const moduleName = 'ovhManagerDedicatedCloudUserEdit';

angular
  .module(moduleName, [])
  .component('dedicatedCloudUserEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
