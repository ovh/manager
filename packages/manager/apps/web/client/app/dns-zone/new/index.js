import productOffers from '@ovh-ux/manager-product-offers';

import routing from './dns-zone-new.routing';
import service from './dns-zone-new.service';
import component from './new.component';

const moduleName = 'ovhManagerWebDomainDnsZoneNew';

angular
  .module(moduleName, [productOffers])
  .config(routing)
  .component('domainDnsZoneNew', component)
  .service('newDnsZone', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
