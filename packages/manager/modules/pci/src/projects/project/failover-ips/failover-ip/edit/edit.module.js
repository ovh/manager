import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import component from './edit.component';
import routing from './edit.routing';

const moduleName = 'ovhManagerPciProjectFailoverIpEdit';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate'])
  .config(routing)
  .component('pciProjectFailoverIpsEdit', component);

export default moduleName;
