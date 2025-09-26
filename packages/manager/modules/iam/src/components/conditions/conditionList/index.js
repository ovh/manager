import angular from 'angular';

import component, { name } from './conditionList.component';
import createConditionModal from '../createConditionModal';

const moduleName = 'ovhManagerIAMConditionList';

angular
  .module(moduleName, [createConditionModal])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
