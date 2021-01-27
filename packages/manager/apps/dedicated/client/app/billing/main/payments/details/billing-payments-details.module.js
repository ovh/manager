import angular from 'angular';
import 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './billing-payments-details.routes';

const moduleName = 'ovhManagerBillingMainPaymentsDetails';

angular
  .module(moduleName, [
    ngOvhUtils,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing);

export default moduleName;
