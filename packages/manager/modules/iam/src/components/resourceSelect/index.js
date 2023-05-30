import angular from 'angular';

import component from './resourceSelect.component';

const moduleName = 'ovhManagerIAMComponentsResourceSelect';

angular
  .module(moduleName, [])
  .component('iamResourceSelect', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
