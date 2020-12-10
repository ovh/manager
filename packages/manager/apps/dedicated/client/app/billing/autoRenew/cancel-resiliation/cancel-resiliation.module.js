import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerBilling from '@ovh-ux/manager-billing';

import routing from './cancel-resiliation.routing';

const moduleName = 'ovhManagerBillingAutorenewCancelResiliation';

angular.module(moduleName, ['ui.router', ovhManagerBilling]).config(routing);

export default moduleName;
