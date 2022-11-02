import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import component from './edit.component';

import routing from './edit.routing';

const moduleName = 'ovhManagerPciProjectAdditionalIpsFailoverIpsEdit';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate'])
  .component('pciAdditionalIpsFailoverIpEdit', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
