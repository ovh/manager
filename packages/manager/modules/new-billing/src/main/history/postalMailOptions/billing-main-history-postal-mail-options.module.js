import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import controller from './billing-main-history-postal-mail-options.controller';
import template from './billing-main-history-postal-mail-options.html';

const moduleName = 'ovhManagerBillingMainHistoryPostalMailOptions';

angular
  .module(moduleName, [
    angularTranslate,
    ngOvhUtils,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .controller('BillingHistoryPostalMailOptionsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/main/history/postalMailOptions/billing-main-history-postal-mail-options.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
