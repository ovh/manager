import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import routing from './white-label-manager.routing';
import component from './white-label-manager.component';
import service from './white-label-manager.service';

const moduleName =
  'ovhManagerTelecomTelephonyBillingAccountAdministrationWhiteLabelManager';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('whiteLabelManagerComponent', component)
  .service('whiteLabelManagerService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
