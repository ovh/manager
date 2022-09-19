import angular from 'angular';
import 'angular-translate';

import activeDirectoriesModule from './activeDirectories';
import vsphereUsersModule from './vsphere-users';

import component from './dedicatedCloud-users.component';

const moduleName = 'ovhManagerDedicatedCloudUsers';

angular
  .module(moduleName, [activeDirectoriesModule, vsphereUsersModule])
  .component('dedicatedCloudUsers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
