import angular from 'angular';
import 'angular-translate';

import component from './dedicatedCloud-user-rights.component';

const moduleName = 'ovhManagerDedicatedCloudUserRights';

angular
  .module(moduleName, [])
  .component('dedicatedCloudUserRights', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
