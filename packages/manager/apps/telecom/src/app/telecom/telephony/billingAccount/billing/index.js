import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import bill from './bill';
import calledFees from './calledFees';
import creditThreshold from './creditThreshold';
import deposit from './deposit';
import depositMovement from './depositMovement';
import groupRepayments from './groupRepayments';
import repaymentHistory from './repaymentHistory';
import summary from './summary';
import tollfreeHistory from './tollfreeHistory';

import routing from './billing.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountBilling';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    bill,
    calledFees,
    creditThreshold,
    deposit,
    depositMovement,
    groupRepayments,
    repaymentHistory,
    summary,
    tollfreeHistory,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
