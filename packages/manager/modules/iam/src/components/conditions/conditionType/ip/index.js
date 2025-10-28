import angular from 'angular';

import component, { name } from './ipCondition.component';

const moduleName = 'ovhManagerIAMConditionIP';

angular
  .module(moduleName, [])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
