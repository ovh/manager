import angular from 'angular';

import resourceType from './resourceType';
import component from './resourceSelect.component';

const moduleName = 'ovhManagerIAMComponentsResourceSelect';

angular
  .module(moduleName, [resourceType])
  .component('iamResourceSelect', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
