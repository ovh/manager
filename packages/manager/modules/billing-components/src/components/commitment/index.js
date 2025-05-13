import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-translate-async-loader';

import component from './commitment.component';
import service from './commitment.service';
import utils from '../utils';

const moduleName = 'ovhManagerBillingCommitment';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    'ngOvhPaymentMethod',
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
    utils,
  ])
  .component('billingCommitment', component)
  .service('BillingCommitmentService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
