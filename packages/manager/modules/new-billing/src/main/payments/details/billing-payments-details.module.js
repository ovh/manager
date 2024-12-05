import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import routing from './billing-payments-details.routes';

const moduleName = 'ovhManagerBillingMainPaymentsDetails';

angular
  .module(moduleName, [angularTranslate, ngOvhUtils, 'oui', uiRouter])
  .config(routing);

export default moduleName;
