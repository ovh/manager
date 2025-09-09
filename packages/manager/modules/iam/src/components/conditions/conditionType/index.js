import angular from 'angular';

import tagCondition from './tag';
import nameCondition from './name';
import ipCondition from './ip';
import component, { name } from './conditionType.component';

const moduleName = 'ovhManagerIAMConditionType';

angular
  .module(moduleName, [tagCondition, nameCondition, ipCondition])
  .component(name, component);

export default moduleName;
