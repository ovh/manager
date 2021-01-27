import angular from 'angular';
import '@uirouter/angularjs';

import details from './details/billing-main-history-debt-details.module';
import pay from './pay/billing-main-history-debt-pay.module';

import routing from './billing-main-history-debt.routes';

const moduleName = 'ovhManagerBillingMainHistoryDebt';

angular.module(moduleName, [details, pay, 'ui.router']).config(routing);

export default moduleName;
