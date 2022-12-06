import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';

import routing from './smppParameter.routing';
import component from './smppParameter.component';

import allowedIps from './allowed-ips/allowed-ips.component';

const moduleName = 'ovhManagerSmsOptionsSmppParameterModule';

angular
  .module(moduleName, [ngAtInternet, 'oui', 'ui.router'])
  .config(routing)
  .component('ovhManagerSmsOptionsSmppParameter', component)
  .component('ovhManagerSmsOptionsSmppParameterAllowedIps', allowedIps)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
