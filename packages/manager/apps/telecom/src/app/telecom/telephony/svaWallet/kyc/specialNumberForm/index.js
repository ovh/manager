import angular from 'angular';

import component from './special-number-form.component';

const moduleName = 'specialNumberForm';

angular
  .module(moduleName, [])
  .component('telecomSvaSpecialNumberForm', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
