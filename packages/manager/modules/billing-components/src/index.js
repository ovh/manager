import angular from 'angular';

import commitment from './components/commitment';
import commitmentDuration from './components/commitment-duration';
import commitmentPricingMode from './components/commitment-pricing-mode';
import contract from './components/contract';
import cancelCommitment from './components/cancel-commitment';
import cancelResiliation from './components/cancel-resiliation';
import resiliation from './components/resiliation';
import cancellationForm from './components/cancellation-form';
import servicesActions from './components/services-actions';
import serviceStatus from './components/service-status';
import splitPayment from './components/split-payment';
import subscriptionTile from './components/subscription-tile';
import { RENEW_URL } from './components/services-actions/service-actions.constants';
import {
  SPLIT_PAYMENT,
  SPLIT_PAYMENT_FEATURE_NAME,
} from './components/split-payment/constants';

const moduleName = 'ovhManagerBilling';

angular.module(moduleName, [
  cancellationForm,
  commitment,
  commitmentDuration,
  commitmentPricingMode,
  contract,
  cancelCommitment,
  cancelResiliation,
  resiliation,
  servicesActions,
  serviceStatus,
  splitPayment,
  subscriptionTile,
]);

export { RENEW_URL, SPLIT_PAYMENT, SPLIT_PAYMENT_FEATURE_NAME };

export default moduleName;
