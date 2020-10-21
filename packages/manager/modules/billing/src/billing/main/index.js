import angular from 'angular';

import '@ovh-ux/manager-core';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import controller from './billing-main.controller';
import routing from './billing-main.routes';

import history from './history';
import payments from './payments';

import billingMainPayAsYouGoCtrl from './payAsYouGo/billing-main-pay-as-you-go.controller';
import billingMainPayAsYouGoRoute from './payAsYouGo/billing-main-pay-as-you-go.routes';

const moduleName = 'ovhManagerBillingMain';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    history,
    payments,
  ])
  .config(routing)
  .controller('BillingMainCtrl', controller)
  .config(billingMainPayAsYouGoRoute)
  .controller('BillingMainPayAsYouGoCtrl', billingMainPayAsYouGoCtrl)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
