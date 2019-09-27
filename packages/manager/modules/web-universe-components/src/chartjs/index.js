import angular from 'angular';

import { CHARTJS } from './chartjs.constant';
import wucChartjsDirective from './chartjs.directive';
import WucChartjsFactory from './chartjs.factory';

const moduleName = 'wucChartjs';

angular
  .module(moduleName, [])
  .constant('WUC_CHARTJS', CHARTJS)
  .directive('wucChartjs', wucChartjsDirective)
  .factory('WucChartjsFactory', WucChartjsFactory);

export default moduleName;
