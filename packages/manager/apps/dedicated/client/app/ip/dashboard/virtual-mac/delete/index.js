import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerDedicatedIpDashboardVirtualMacDelete';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipDashboardVirtualMacDelete', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../../translations */);

export default moduleName;
