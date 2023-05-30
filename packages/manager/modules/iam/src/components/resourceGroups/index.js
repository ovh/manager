import angular from 'angular';

import component from './resourceGroups.component';

const moduleName = 'ovhManagerIAMComponentsResourceGroups';

angular
  .module(moduleName, [])
  .component('iamResourceGroups', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
