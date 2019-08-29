import angular from 'angular';

import wucGaugeChartDirective from './gaugeChart/gaugeChart';

const moduleName = 'wucCharts';

angular
  .module(moduleName, [])
  .directive('wucGaugeChart', wucGaugeChartDirective);

export default moduleName;
