import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './terminate-enterprise-cloud-database.component';
import routing from './terminate-enterprise-cloud-database.routing';

import terminate from '../terminate/terminate.module';

const moduleName = 'ovhManagerBillingAutorenewTerminateEnterpriseCloudDatabase';

angular
  .module(moduleName, [
    ngAtInternet,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    terminate,
    'ui.router',
  ])
  .config(routing)
  .component('billingAutorenewTerminateEnterpriseCloudDatabase', component);

export default moduleName;
