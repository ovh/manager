import angular from 'angular';
import chartjs from 'angular-chart.js';

import metricsChart from './metrics-chart.component';

const moduleName =
  'ovhManagerPciProjectServingNamespaceModelsDetailsMetricsLazyloading';

angular
  .module(moduleName, [chartjs])
  .component('pciProjectServingNamespaceModelsDetailsMetrics', metricsChart)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
