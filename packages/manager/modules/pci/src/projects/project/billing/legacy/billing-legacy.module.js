import angular from 'angular';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import estimate from '../estimate';
import component from './billing-legacy.component';
import service from './billing.service';

const moduleName = 'ovhManagerPciProjectBillingLegacy';

angular
  .module(moduleName, [
    estimate,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('pciProjectBillingLegacy', component)
  .service('CloudProjectBilling', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
