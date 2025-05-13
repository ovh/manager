import angular from 'angular';

import chartPieComponent from './metrics-chart-pie.component';

import './metrics-chart-pie.less';

const moduleName = 'ovhMetricsDashboardChartPieModule';

angular
  .module(moduleName, [])
  .component('metricsDashboardChartPieComponent', chartPieComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
