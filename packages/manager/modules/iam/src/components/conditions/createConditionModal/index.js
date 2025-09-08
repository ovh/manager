import angular from 'angular';

import tagCondition from '../tag';
import component, { name } from './createConditionModal.component';

const moduleName = 'ovhManagerIAMCreateConditionModal';

angular
  .module(moduleName, [tagCondition])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
