import angular from 'angular';

import timezone from '../timezone';
import component, { name } from './hourCondition.component';

const moduleName = 'ovhManagerIAMConditionHour';

angular
  .module(moduleName, [timezone])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
