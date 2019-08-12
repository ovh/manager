import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import deleteInstance from '../instance/active-monthly-billing/active-monthly-billing.module';
import routing from './active-monthly-billing.routing';

const moduleName = 'ovhManagerPciInstancesActiveMonthlyBilling';

angular
  .module(moduleName, [
    deleteInstance,
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
