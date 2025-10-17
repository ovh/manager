import angular from 'angular';

import conditionType from '../conditionType';
import component, { name } from './createConditionModal.component';

const moduleName = 'ovhManagerIAMCreateConditionModal';

angular
  .module(moduleName, [conditionType])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
