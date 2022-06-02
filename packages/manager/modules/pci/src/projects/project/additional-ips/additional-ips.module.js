import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import additionalIp from './additional-ip';
import imports from './imports';
import onboarding from './onboarding';
import order from './order';

import component from './additional-ips.component';
import routing from './additional-ips.routing';
import instancesModule from '../instances/instances.module';
import service from './service';

const moduleName = 'ovhManagerPciProjectAdditionalIps';

angular
  .module(moduleName, [
    'ui.router',
    'pascalprecht.translate',
    additionalIp,
    imports,
    instancesModule,
    onboarding,
    order,
  ])
  .config(routing)
  .component('pciProjectAdditionalIps', component)
  .service('additionalIpService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
