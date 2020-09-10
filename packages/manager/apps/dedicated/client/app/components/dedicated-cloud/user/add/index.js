import angular from 'angular';
import 'angular-translate';

import component from './dedicatedCloud-user-add.component';

const moduleName = 'ovhManagerDedicatedCloudUserAdd';

angular
  .module(moduleName, [])
  .component('dedicatedCloudUserAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
