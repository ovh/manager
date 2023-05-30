import angular from 'angular';

import component from './createPolicy.component';

const moduleName = 'ovhManagerIAMComponentsCreatePolicy';

angular
  .module(moduleName, [])
  .component('iamCreatePolicy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
