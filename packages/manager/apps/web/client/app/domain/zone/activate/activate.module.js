import angular from 'angular';
import 'angular-translate';

import component from './activate.component';
import routing from './activate.routing';
import zoneActivateService from './activate.service';

const moduleName = 'ovhManagerWebDomainZoneActivateModule';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('domainZoneActivate', component)
  .service('DomainDnsZoneActivateService', zoneActivateService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
