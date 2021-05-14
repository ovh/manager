import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import creditLegacyComponent from './credit-legacy/credit-legacy.component';
import creditAgoraComponent from './credit-agora/credit-agora.component';

import routing from './credit.routing';

const moduleName = 'ovhManagerPciProjectVouchersCredit';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectsProjectVouchersCreditAgora', creditAgoraComponent)
  .component('pciProjectsProjectVouchersCreditLegacy', creditLegacyComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
