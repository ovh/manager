import angular from 'angular';

import calendar from './calendar';
import slot from './slot';

import './time-condition.less';

const moduleName = 'ovhManagerTelecomComponentsTelecomTelephonyTimeCondition';

angular.module(moduleName, [calendar, slot]);

export default moduleName;
