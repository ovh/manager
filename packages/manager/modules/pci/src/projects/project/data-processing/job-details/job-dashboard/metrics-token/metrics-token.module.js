import angular from 'angular';

import component from './metrics-token.component';
import routing from './metrics-token.routing';

const moduleName =
  'ovhManagerPciProjectDataProcessingMetricsTokenModalComponent';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectDataProcessingMetricsTokenModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
