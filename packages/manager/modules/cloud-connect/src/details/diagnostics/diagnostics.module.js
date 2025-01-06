import angular from 'angular';

import component from './diagnostics.component';
import routing from './diagnostics.routing';

const moduleName = 'ovhCloudConnectDetailsDiagnostics';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsDiagnostics', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
