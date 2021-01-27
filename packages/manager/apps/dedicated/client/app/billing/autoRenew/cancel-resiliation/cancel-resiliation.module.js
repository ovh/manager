import angular from 'angular';
import ovhManagerBilling from '@ovh-ux/manager-billing';
import uiRouter from '@uirouter/angularjs';

import routing from './cancel-resiliation.routing';

const moduleName = 'ovhManagerBillingAutorenewCancelResiliation';

angular.module(moduleName, [ovhManagerBilling, uiRouter]).config(routing);

export default moduleName;
