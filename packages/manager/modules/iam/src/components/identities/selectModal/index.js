import angular from 'angular';

import component from './selectModal.component';

const moduleName = 'ovhManagerIAMSelectModal';

angular
  .module(moduleName, [])
  .component('iamSelectModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
