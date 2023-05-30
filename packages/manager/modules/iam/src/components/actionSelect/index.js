import angular from 'angular';

import component from './actionSelect.component';

const moduleName = 'ovhManagerIAMComponentsActionSelect';

angular
  .module(moduleName, [])
  .component('iamActionSelect', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
