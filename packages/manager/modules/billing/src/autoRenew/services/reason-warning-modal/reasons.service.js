import AnticipatePaymentReasonsStrategy from './action-reasons-strategies/anticipate-payment-reasons.strategy';
import ResiliateReasonsStrategy from './action-reasons-strategies/resiliate-reasons.strategy';

export default class {
  /* @ngInject */
  constructor(SERVICE_ACTIONS) {
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
}
