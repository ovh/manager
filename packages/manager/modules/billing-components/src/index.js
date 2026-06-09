import angular from 'angular';

import commitment from './components/commitment';
import commitmentDuration from './components/commitment-duration';
import commitmentPricingMode from './components/commitment-pricing-mode';
import cancelCommitment from './components/cancel-commitment';
import cancelResiliation from './components/cancel-resiliation';
import exchangeRenew from './components/exchange-renew';
import resiliateModal from './components/resiliate-modal';
import resiliationModal from './components/resiliation-modal';
import resiliation from './components/resiliation';
import cancellationForm from './components/cancellation-form';
import servicesActions from './components/services-actions';
import serviceStatus from './components/service-status';
import splitPayment from './components/split-payment';
import terminate from './components/terminate';
import terminateAgoraService from './components/terminate-agora-service';
import subscriptionTile from './components/subscription-tile';
import autoRenew2016DeploymentBanner from './components/auto-renew-2016-deployment-banner';
import { RENEW_URL } from './components/services-actions/service-actions.constants';
import {
  SPLIT_PAYMENT,
  SPLIT_PAYMENT_FEATURE_NAME,
} from './components/split-payment/constants';
import autoRenewPaymentMethod from './components/payment-method';
import autoRenewTips from './components/auto-renew-tips';
import { SERVICE_ACTIONS } from './constants';

const moduleName = 'ovhManagerBilling';

angular
  .module(moduleName, [
    cancellationForm,
    commitment,
    commitmentDuration,
    commitmentPricingMode,
    cancelCommitment,
    cancelResiliation,
    exchangeRenew,
    resiliateModal,
    resiliationModal,
    resiliation,
    servicesActions,
    serviceStatus,
    splitPayment,
    terminate,
    terminateAgoraService,
    subscriptionTile,
    autoRenew2016DeploymentBanner,
    autoRenewPaymentMethod,
    autoRenewTips,
  ])
  .constant('SERVICE_ACTIONS', SERVICE_ACTIONS);

export { RENEW_URL, SPLIT_PAYMENT, SPLIT_PAYMENT_FEATURE_NAME };

export default moduleName;
