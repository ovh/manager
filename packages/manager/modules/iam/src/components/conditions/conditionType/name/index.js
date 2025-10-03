import angular from 'angular';

import component, { name } from './nameCondition.component';

const moduleName = 'ovhManagerIAMConditionName';

angular
  .module(moduleName, [])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
