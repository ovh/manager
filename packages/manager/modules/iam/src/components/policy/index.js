import angular from 'angular';

import component from './policy.component';

const moduleName = 'ovhManagerIAMComponentsPolicy';

angular
  .module(moduleName, [])
  .component('iamPolicy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
