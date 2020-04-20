import 'angular-translate';
import productOffers from '@ovh-ux/manager-product-offers';
import component from './detach.component';
import routing from './detach.routing';

const moduleName = 'ovhManagerWebDomainZoneDetach';

angular
  .module(moduleName, ['pascalprecht.translate', productOffers])
  .config(routing)
  .component('domainZoneDetach', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
