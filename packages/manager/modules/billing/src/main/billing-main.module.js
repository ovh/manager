import angular from 'angular';
import angularTranslate from 'angular-translate';
import ovhManagerCore from '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import history from './history/history.module';
import payments from './payments/billing-payments.module';
import payAsYouGo from './payAsYouGo/billing-main-pay-as-you-go.module';

import routing from './billing-main.routes';

const moduleName = 'ovhManagerBillingMain';

angular
  .module(moduleName, [
    angularTranslate,
    history,
    ngTranslateAsyncLoader,
    'oui',
    ovhManagerCore,
    payments,
    payAsYouGo,
    uiRouter,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
