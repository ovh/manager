import angular from 'angular';
import '@uirouter/angularjs';

import priceDetailsComponent from './price-details.component';

const moduleName =
  'ovhManagerPciProjectDataProcessingSubmitJobPriceDetailsLazyLoading';

angular
  .module(moduleName, ['ui.router'])
  .component(
    'pciProjectDataProcessingSubmitPriceDetails',
    priceDetailsComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
