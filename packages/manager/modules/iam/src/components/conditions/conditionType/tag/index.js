import angular from 'angular';

import component, { name } from './tagCondition.component';

const moduleName = 'ovhManagerIAMConditionTag';

angular
  .module(moduleName, [])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
