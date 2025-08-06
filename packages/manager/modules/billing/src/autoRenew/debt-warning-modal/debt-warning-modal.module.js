import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './debt-warning-modal.component';
import routing from './debt-warning-modal.routing';

const moduleName = 'ovhManagerBillingAutorenewDebtWarningModal';

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
  .component('debtWarningModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
