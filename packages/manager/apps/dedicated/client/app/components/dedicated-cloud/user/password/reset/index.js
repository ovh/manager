import angular from 'angular';
import 'angular-translate';

import component from './dedicatedCloud-user-password-reset.component';

const moduleName = 'ovhManagerDedicatedCloudUserPasswordReset';

angular
  .module(moduleName, [])
  .component('dedicatedCloudUserPasswordReset', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
