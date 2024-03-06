import angular from 'angular';

import { CHARTJS } from './constants';
import chartDirective from './directive';
import chartFactory from './factory';

const moduleName = 'ngOvhChart';

angular
  .module(moduleName, [])
  .constant('CHARTS', CHARTJS)
  .directive('chart', chartDirective)
  .factory('ChartFactory', chartFactory);

export default moduleName;
