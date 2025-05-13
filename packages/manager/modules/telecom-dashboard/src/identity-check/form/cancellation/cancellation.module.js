import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import 'angular-translate';

import component from './cancellation.component';
import routing from './cancellation.routing';
import service from '../../telecom-dashboard-identity-check.service';

const moduleName = 'ovhManagerTelecomDashboardIdentityCheckFormCancellation';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngOvhTelecomUniverseComponents',
    'ui.router',
  ])
  .config(routing)
  .component('identityCheckFormCancellation', component)
  .service('IdentityCheckService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
