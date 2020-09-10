import angular from 'angular';
import 'angular-translate';

import component from './dedicatedCloud-user.component';

const moduleName = 'ovhManagerDedicatedCloudUser';

angular
  .module(moduleName, [])
  .component('dedicatedCloudUser', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
