import angular from 'angular';

import component from './result.component';
import routing from './result.routing';

const moduleName = 'ovhCloudConnectDiagnosticResult';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDiagnosticResult', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
