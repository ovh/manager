import angular from 'angular';

import component from './advancedModeSwitch.component';

const moduleName = 'ovhManagerIAMComponentsAdvancedModeSwitch';

angular
  .module(moduleName, [])
  .component('iamAdvancedModeSwitch', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
