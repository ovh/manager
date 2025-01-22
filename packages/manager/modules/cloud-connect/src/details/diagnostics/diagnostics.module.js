import angular from 'angular';

import component from './diagnostics.component';
import routing from './diagnostics.routing';

const moduleName = 'ovhCloudConnectDiagnosticsDetails';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDiagnosticsDetails', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
