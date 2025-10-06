import angular from 'angular';

import elementUiService from './elementUi.service';

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
  .service('elementUiService', elementUiService)
  .component(name, component);

export default moduleName;
