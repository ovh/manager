import angular from 'angular';
import chartjs from 'angular-chart.js';

import dataProcessingMetricsChartComponent from './metrics-chart.component';

const moduleName = 'OvhManagerPciProjectDataProcessingMetricsChartLazyLoading';

angular
  .module(moduleName, [chartjs])
  .component(
    'pciProjectDataProcessingMetricsChart',
    dataProcessingMetricsChartComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
