import angular from 'angular';
import chartjs from 'angular-chart.js';

import dataProcessingMetricsChartComponent from './metrics-chart.component';

const moduleName = 'OvhManagerDataProcessingMetricsChartComponent';

angular
  .module(moduleName, [chartjs])
  .component('dataprocessingMetricsChart', dataProcessingMetricsChartComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
