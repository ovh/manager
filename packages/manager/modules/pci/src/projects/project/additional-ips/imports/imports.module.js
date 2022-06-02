import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import importIp from './import';
import routing from './imports.routing';

const moduleName = 'ovhManagerPciProjectAdditionalIpsImports';

angular
  .module(moduleName, [importIp, 'ui.router', 'pascalprecht.translate'])
  .config(routing);

export default moduleName;
