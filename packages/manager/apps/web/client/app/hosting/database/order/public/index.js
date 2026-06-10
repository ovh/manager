import angularTranslate from 'angular-translate';

import ovhManagerProductOffers from '@ovh-ux/manager-product-offers';

import component from './hosting-database-order-public.component';
import routing from './hosting-database-order-public.routing';
import service from './hosting-database-order-public.service';
import starterPricingOverlay from './starter-pricing-overlay.directive';

import dbCategoriesOffers from './components/steps/db-categories-offers';

const moduleName = 'ovhManagerHostingDatabaseOrderPublic';

angular
  .module(moduleName, [
    angularTranslate,
    ovhManagerProductOffers,
    dbCategoriesOffers,
  ])
  .component(component.name, component)
  .directive('starterPricingOverlay', starterPricingOverlay)
  .service('HostingDatabaseOrderPublicService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
