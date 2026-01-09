import AnticipatePaymentReasonsStrategy from './action-reasons-strategies/anticipate-payment-reasons.strategy';
import ResiliateReasonsStrategy from './action-reasons-strategies/resiliate-reasons.strategy';
import { SERVICE_ACTIONS } from './reason-warning-modal.constants';

export default class {
  /* @ngInject */
  constructor() {
    this.SERVICE_ACTIONS = SERVICE_ACTIONS;
  }

  getReasonStrategy(action) {
    switch (action) {
      case this.SERVICE_ACTIONS.ANTICIPATE_PAYMENT:
        return new AnticipatePaymentReasonsStrategy();

      case this.SERVICE_ACTIONS.RESILIATE:
        return new ResiliateReasonsStrategy();

      default:
        return {
          getReasons: () => [],
        };
    }
  }

  getTrackingActionLabel(action) {
    switch (action) {
      case this.SERVICE_ACTIONS.ANTICIPATE_PAYMENT:
        return 'go-to-anticipate-payment';

      case this.SERVICE_ACTIONS.RESILIATE:
        return 'go-to-resiliate';

      default:
        return null;
    }
  }
}
