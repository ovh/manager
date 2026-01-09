import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './order-product.component';
import routing from './order-product.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountOrderProduct';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('telecomTelephonyBillingAccountOrderProduct', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
