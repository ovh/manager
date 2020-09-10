import angular from 'angular';
import 'angular-translate';

import component from './dedicatedCloud-user-rights-edit.component';

const moduleName = 'ovhManagerDedicatedCloudUserRightsEdit';

angular
  .module(moduleName, [])
  .component('dedicatedCloudUserRightsEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
