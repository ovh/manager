import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import add from './add';
import deleteModule from './delete';

import component from './virtual-mac.component';
import routing from './virtual-mac.routing';
import service from './virtual-mac.service';

const moduleName = 'ovhManagerDedicatedIpDashboardVirtualMac';

angular
  .module(moduleName, [
    add,
    deleteModule,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('ipDashboardVirtualMac', component)
  .service('IpDashboardVirtualMac', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
