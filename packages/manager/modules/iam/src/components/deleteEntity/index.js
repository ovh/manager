import angular from 'angular';

import component from './deleteEntity.component';

const moduleName = 'ovhManagerIAMComponentsDeleteEntity';

angular
  .module(moduleName, [])
  .component('iamDeleteEntity', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
