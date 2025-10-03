import angular from 'angular';

import component, { name } from './productTypeCondition.component';

const moduleName = 'ovhManagerIAMConditionProductType';

angular
  .module(moduleName, ['ovhManagerIAMComponentsResourceType'])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
