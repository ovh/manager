import angular from 'angular';
import 'angular-translate';

import routing from './dns-zone-new.routing';
import component from './new.component';
import service from './dns-zone-new.service';

const moduleName = 'ovhManagerWebDomainDnsZoneNew';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .config(routing)
  .component('domainDnsZoneNew', component)
  .service('DnsZoneNewService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
