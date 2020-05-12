import angularTranslate from 'angular-translate';

import ovhManagerProductOffers from '@ovh-ux/manager-product-offers';

import component from './hosting-database-order-public.component';
import routing from './hosting-database-order-public.routing';
import service from './hosting-database-order-public.service';

const moduleName = 'ovhManagerHostingDatabaseOrderPublic';

angular
  .module(moduleName, [angularTranslate, ovhManagerProductOffers])
  .component(component.name, component)
  .service('HostingDatabaseOrderPublicService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
