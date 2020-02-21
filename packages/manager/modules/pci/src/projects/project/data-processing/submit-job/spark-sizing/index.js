import angular from 'angular';
import '@uirouter/angularjs';

import SparkSizingComponent from './spark-sizing.component';

const moduleName = 'ovhManagerDataProcessingSubmitJobSparkSizing';

angular
  .module(moduleName, ['ui.router'])
  .component('dataprocessingSubmitJobSparkSizing', SparkSizingComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
