import angular from 'angular';
import 'angular-translate';

import iamModule from './iam';
import vsphereUsersModule from './vsphere-users';

import component from './dedicatedCloud-users.component';

const moduleName = 'ovhManagerDedicatedCloudUsers';

angular
  .module(moduleName, [iamModule, vsphereUsersModule])
  .component('dedicatedCloudUsers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
