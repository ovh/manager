import angular from 'angular';
import 'angular-translate';
import 'ovh-ui-angular';

import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import extraPricingDetailComponent from './extra-pricing-detail.component';

const moduleName = 'ovhManagerProductOffersPricingExtra';

angular
  .module(moduleName, [ovhManagerCatalogPrice, 'oui', 'pascalprecht.translate'])
  .component(
    'ovhManagerProductOffersExtraPricingDetail',
    extraPricingDetailComponent,
  );

export default moduleName;
