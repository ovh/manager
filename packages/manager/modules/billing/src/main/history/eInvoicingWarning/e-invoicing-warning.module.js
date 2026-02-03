import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './e-invoicing-warning.component';

const moduleName = 'ovhManagerBillingMainHistoryPostalMailOptions';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .component('eInvoicingWarning', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
