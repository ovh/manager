import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import failoverIps from './failover-ips';
import floatingIps from './floating-ips';
import onboarding from './onboarding';
import order from './order';
import imports from './imports';
import PciProjectAdditionalIpService from './service';

import component from './additional-ips.component';
import routing from './additional-ips.routing';
import instancesModule from '../instances/instances.module';

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
    PciProjectAdditionalIpService,
  ])
  .config(routing)
  .component('pciProjectAdditionalIps', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
