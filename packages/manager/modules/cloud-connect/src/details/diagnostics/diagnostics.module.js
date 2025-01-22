import angular from 'angular';

import component from './diagnostics.component';
import routing from './diagnostics.routing';
import ovhCloudConnectDiagnosticsResult from './result';

const moduleName = 'ovhCloudConnectDiagnosticsDetails';

angular
  .module(moduleName, [ovhCloudConnectDiagnosticsResult])
  .config(routing)
  .component('cloudConnectDiagnosticsDetails', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
