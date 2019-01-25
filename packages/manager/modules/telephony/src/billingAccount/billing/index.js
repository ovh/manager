import angular from 'angular';

import bill from './bill';
import calledFees from './calledFees';
import creditThreshold from './creditThreshold';
import deposit from './deposit';
import depositMovement from './depositMovement';
import groupRepayments from './groupRepayments';
import repaymentHistory from './repaymentHistory';
import summary from './summary';
import tollfreeHistory from './tollfreeHistory';

import routing from './billing-account-billing.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.billing';

angular
  .module(moduleName, [
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
  .config(routing);

export default moduleName;
