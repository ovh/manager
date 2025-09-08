import angular from 'angular';

import component, { name } from './conditionList.component';

const moduleName = 'ovhManagerIAMConditionList';

angular.module(moduleName, []).component(name, component);

export default moduleName;
