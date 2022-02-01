import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-ui-router-title';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/manager-telecom-styles';
import 'angular-translate';
import 'angular-ui-validate';

import component from './telecom-dashboard-identity-check-form.component';
import routing from './telecom-dashboard-identity-check-form.routing';
import service from '../telecom-dashboard-identity-check.service';

import cancellation from './cancellation';

const moduleName = 'ovhManagerTelecomDashboardIdentityCheckForm';

angular
  .module(moduleName, [
    cancellation,
    'ngUiRouterTitle',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ngOvhTelecomUniverseComponents',
    'ui.router',
    'ui.validate',
  ])
  .config(routing)
  .component('identityCheckForm', component)
  .service('IdentityCheckService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
