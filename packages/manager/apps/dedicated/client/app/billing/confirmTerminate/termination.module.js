import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import billing from '@ovh-ux/manager-billing';
import routing from './termination.routing';

import legacyService from './legacy/termination-legacy.service';

const moduleName = 'ovhManagerBillingTermination';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    billing,
  ])
  .config(routing)
  .service('BillingTerminateLegacy', legacyService);

export default moduleName;
