import angular from 'angular';
import pieChartDirective from './telephony-group-consumption-pie-chart.directive';
import './telephony-group-consumption-pie-chart.less';

const moduleName = 'ovhManagerTelephonyGroupConsumptionPieChart';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .directive('groupConsumptionPieChart', pieChartDirective);

export default moduleName;
