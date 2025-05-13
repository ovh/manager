import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import billingComponents from '@ovh-ux/manager-billing-components';
import routing from './termination.routing';

import legacyService from './legacy/termination-legacy.service';

const moduleName = 'ovhManagerBillingTermination';

angular
  .module(moduleName, [
    angularTranslate,
    billingComponents,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .service('BillingTerminateLegacy', legacyService);

export default moduleName;
