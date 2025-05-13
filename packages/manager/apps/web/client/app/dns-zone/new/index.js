import productOffers from '@ovh-ux/manager-product-offers';

import routing from './dns-zone-new.routing';
import component from './new.component';

const moduleName = 'ovhManagerWebDomainDnsZoneNew';

angular
  .module(moduleName, [productOffers])
  .config(routing)
  .component('domainDnsZoneNew', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
