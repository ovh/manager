import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import edit from './edit';
import terminate from './terminate';

import routing from './failover-ips.routing';
import component from './failover-ips.component';

const moduleName = 'ovhManagerPciProjectAdditionalIpsFailoverIps';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate', edit, terminate])
  .config(routing)
  .component('pciProjectAdditionalIpsFailoverIps', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
