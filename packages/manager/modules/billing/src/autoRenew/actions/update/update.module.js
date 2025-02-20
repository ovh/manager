import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './update.component';
import service from './update.service';
import routing from './update.routing';
import updatePeriodTranslationService from './update-period-translation.service';

const moduleName = 'ovhManagerBillingAutorenewUpdate';

angular
  .module(moduleName, [
    angularTranslate,
    ngAtInternet,
    ngOvhUtils,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .service('ovhUpdateAutoRenewServiceModalService', service)
  .service('ovhUpdatePeriodTranslationService', updatePeriodTranslationService)
  .component('billingAutorenewUpdate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
