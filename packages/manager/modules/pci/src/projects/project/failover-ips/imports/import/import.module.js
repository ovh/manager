import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import routing from './import.routing';

const moduleName = 'ovhManagerPciProjectFailoverIpsImportsImport';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate'])
  .config(routing);

export default moduleName;
