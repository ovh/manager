import angular from 'angular';

import tagCondition from './tag';
import nameCondition from './name';
import ipCondition from './ip';
import weekdayCondition from './weekday';
import dateCondition from './date';
import hourCondition from './hour';
import productTypeCondition from './productType';
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
    productTypeCondition,
  ])
  .component(name, component);

export default moduleName;
