import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './terminate-enterprise-cloud-database.component';
import routing from './terminate-enterprise-cloud-database.routing';

import terminate from '../terminate/terminate.module';

const moduleName = 'ovhManagerBillingAutorenewTerminateEnterpriseCloudDatabase';

angular
  .module(moduleName, [
    angularTranslate,
    ngAtInternet,
    ngTranslateAsyncLoader,
    'oui',
    terminate,
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewTerminateEnterpriseCloudDatabase', component);

export default moduleName;
