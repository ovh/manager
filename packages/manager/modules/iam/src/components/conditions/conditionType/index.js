import angular from 'angular';

import tagCondition from './tag';
import nameCondition from './name';
import ipCondition from './ip';
import weekdayCondition from './weekday';
import dateCondition from './date';
import hourCondition from './hour';
import component, { name } from './conditionType.component';

const moduleName = 'ovhManagerIAMConditionType';

angular
  .module(moduleName, [
    tagCondition,
    nameCondition,
    ipCondition,
    weekdayCondition,
    dateCondition,
    hourCondition,
  ])
  .component(name, component);

export default moduleName;
