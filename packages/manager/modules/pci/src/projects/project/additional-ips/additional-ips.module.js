import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import failoverIps from './failover-ips';
import floatingIps from './floating-ips';
import onboarding from './onboarding';
import order from './order';
import imports from './imports';

import component from './additional-ips.component';
import routing from './additional-ips.routing';
import instancesModule from '../instances/instances.module';
import service from './service';

const moduleName = 'ovhManagerPciProjectAdditionalIps';

angular
  .module(moduleName, [
    'ui.router',
    'pascalprecht.translate',
    failoverIps,
    floatingIps,
    imports,
    instancesModule,
    onboarding,
    order,
  ])
  .config(routing)
  .component('pciProjectAdditionalIps', component)
  .service('PciProjectAdditionalIpService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
