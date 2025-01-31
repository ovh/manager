import angular from 'angular';

import component from './diagnostics.component';
import routing from './diagnostics.routing';
import service from './diagnostics.service';

import ovhCloudConnectDiagnosticsResult from './result';

const moduleName = 'ovhCloudConnectDiagnosticsDetails';

angular
  .module(moduleName, [ovhCloudConnectDiagnosticsResult])
  .config(routing)
  .service('cloudConnectDiagnosticsService', service)
  .component('cloudConnectDiagnosticsDetails', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
