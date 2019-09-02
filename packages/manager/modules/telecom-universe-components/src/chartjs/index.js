import angular from 'angular';

import { CHARTJS } from './chartjs.constants';
import tucChartjsDirective from './chartjs.directive';
import tucChartjsFactory from './chartjs.factory';

const moduleName = 'tucChartjs';

angular
  .module(moduleName, [])
  .constant('TUC_CHARTS', CHARTJS)
  .directive('tucChartjs', tucChartjsDirective)
  .factory('TucChartjsFactory', tucChartjsFactory);

export default moduleName;
