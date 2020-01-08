import angular from 'angular';

import tucGaugeDirective from './gauge.directive';
import './gauge.less';

const moduleName = 'tucGauge';

angular.module(moduleName, []).directive('tucGauge', tucGaugeDirective);

export default moduleName;
