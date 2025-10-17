import angular from 'angular';

import timezone from '../timezone';
import component, { name } from './dateCondition.component';

const moduleName = 'ovhManagerIAMConditionDate';

angular
  .module(moduleName, [timezone])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
