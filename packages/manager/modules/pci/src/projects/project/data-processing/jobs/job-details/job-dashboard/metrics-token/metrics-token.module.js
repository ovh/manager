import angular from 'angular';
import angularTranslate from 'angular-translate';

import component from './metrics-token.component';
import routing from './metrics-token.routing';

const moduleName = 'ovhManagerPciProjectDataProcessingMetricsTokenModal';

angular
  .module(moduleName, [angularTranslate])
  .config(routing)
  .component('pciProjectDataProcessingMetricsTokenModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
