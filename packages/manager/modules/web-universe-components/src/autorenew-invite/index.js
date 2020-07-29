import angular from 'angular';

import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-ovh-user-pref';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import { SUBSIDIARIES_WITH_OPTIONAL_AUTORENEW } from './autorenew-invite.constant';
import WucAutorenewInvite from './autorenew-invite.component';

const moduleName = 'wucAutorenewInvite';

angular
  .module(moduleName, [
    'ngOvhPaymentMethod',
    'ngOvhUserPref',
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'oui',
    'pascalprecht.translate',
  ])
  .constant(
    'WUC_SUBSIDIARIES_WITH_OPTIONAL_AUTORENEW',
    SUBSIDIARIES_WITH_OPTIONAL_AUTORENEW,
  )
  .component('wucAutorenewInvite', WucAutorenewInvite)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
