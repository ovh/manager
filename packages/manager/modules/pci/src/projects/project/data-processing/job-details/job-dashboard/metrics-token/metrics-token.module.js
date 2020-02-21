import angular from 'angular';

import component from './metrics-token.component';
import routing from './metrics-token.routing';

const moduleName = 'ovhManagerDataProcessingMetricsTokenModalComponent';

angular
  .module(moduleName, [])
  .config(routing)
  .component('dataprocessingMetricsTokenModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
