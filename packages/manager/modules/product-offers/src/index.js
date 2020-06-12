import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';
import ngOvhContracts from '@ovh-ux/ng-ovh-contracts';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import detachService from './services/product-offers-detach.service';
import service from './services/product-offers.service';

import component from './product-offers.component';
import pricingConstants from './pricing/pricing.constants';
import workflowConstants from './workflows/product-offers-workflow.constants';
import extraPricingDetail from './pricing/extra-pricing-detail';

import './product-offers.scss';

export { pricingConstants, workflowConstants };

const moduleName = 'ovhManagerProductOffers';

angular
  .module(moduleName, [
    'oui',
    extraPricingDetail,
    ngOvhContracts,
    ngOvhPaymentMethod,
    ngOvhWebUniverseComponents,
    ngTranslateAsyncLoader,
    ovhManagerCatalogPrice,
    'pascalprecht.translate',
  ])
  .component('ovhManagerProductOffers', component)
  .constant('OVH_MANAGER_PRODUCT_OFFERS_PRICING_CONSTANTS', pricingConstants)
  .constant('OVH_MANAGER_PRODUCT_OFFERS_WORKFLOW_CONSTANTS', workflowConstants)
  .service('ovhManagerProductOffersDetachService', detachService)
  .service('ovhManagerProductOffersService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
