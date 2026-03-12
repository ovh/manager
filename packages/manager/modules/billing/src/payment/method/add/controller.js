import {
  GlobalStateComponentStatus,
  GlobalStatePaymentMethodStatus,
} from './constants';

export default class PaymentMethodAddController {
  /* @ngInject */
  constructor(coreConfig, $location, $timeout) {
    this.user = coreConfig.getUser();
    this.userLocale = coreConfig.getUserLocale();
    this.hostname = window.location.hostname;
    this.$location = $location;
    this.$timeout = $timeout;
  }

  $onInit() {
    const container = document.getElementById('billing-payment-method-add');

    // clear any previous mount and notify the previous instance to teardown
    // if it listens for the custom teardown event
    let eventBus;
    const prev = container.querySelector('.billing-payment-method-root');
    if (prev) {
      try {
        prev.dispatchEvent(
          new CustomEvent('willPayment:teardown', { bubbles: true }),
        );
      } catch (e) {
        // ignore if CustomEvent not supported
      }
      // remove previous content and create a fresh event bus node
      container.innerHTML = '';
      eventBus = document.createElement('div');
      eventBus.className = 'billing-payment-method-root';
      container.appendChild(eventBus);
    } else {
      // first mount: create the root node used as event bus/host
      eventBus = document.createElement('div');
      eventBus.className = 'billing-payment-method-root';
      container.appendChild(eventBus);
    }
    this.setupPaymentAdd(container, {
      configuration: {
        baseUrl: window.location.origin,
        onChange: (state) => {
          // handle redirection for SEPA direct debit
          if (
            state?.componentStatus ===
              GlobalStateComponentStatus.REDIRECTION_NEEDED &&
            state?.data?.url &&
            window.top
          ) {
            window.top.location.href = state.data.url;
            return null;
          }
          console.log('Payment method add state changed:', state);
          switch (state.paymentMethodStatus) {
            case GlobalStatePaymentMethodStatus.CHALLENGE_REFUSED:
            case GlobalStatePaymentMethodStatus.CHALLENGE_ERROR:
            case GlobalStatePaymentMethodStatus.ERROR:
              if (state?.data?.status === 'cancel') {
                this.$timeout(() => {
                  this.$location
                    .search('paymentMethod', null)
                    .search('paymentMethodId', null)
                    .search('status', null)
                    .replace();
                }, 0);
                return null;
              }
              return this.onPaymentMethodAddError(state?.data?.message);

            case GlobalStatePaymentMethodStatus.REGISTERED:
            case GlobalStatePaymentMethodStatus.PAYMENT_METHOD_SAVED:
              return this.onPaymentMethodAdded();

            default:
              return null;
          }
        },
        subsidiary: this.user.ovhSubsidiary,
        language: this.userLocale,
        hostApp: 'manager',
        eventBus,
      },
    });
  }
}
