import angular from 'angular';
import 'angular-translate';

import component from './activeDirectories.component';

const moduleName = 'ovhManagerDedicatedCloudActivesDirectories';

angular
  .module(moduleName, [])
  .component('dedicatedCloudActiveDirectories', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
