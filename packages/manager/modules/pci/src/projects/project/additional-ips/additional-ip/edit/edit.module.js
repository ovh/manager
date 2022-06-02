import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import component from './edit.component';
import routing from './edit.routing';

const moduleName = 'ovhManagerPciProjectAdditionalIpEdit';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate'])
  .config(routing)
  .component('pciProjectAdditionalIpsEdit', component);

export default moduleName;
