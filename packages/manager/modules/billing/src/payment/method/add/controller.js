import {
  GlobalStateComponentStatus,
  GlobalStatePaymentMethodStatus,
} from './constants';

export default class PaymentMethodAddController {
  /* @ngInject */
  constructor(coreConfig, $state, $timeout) {
    this.user = coreConfig.getUser();
    this.userLocale = coreConfig.getUserLocale();
    this.hostname = window.location.hostname;
    this.$state = $state;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.element = document.getElementById('billing-payment-method-add');

    this.teardownPaymentAdd = this.setupPaymentAdd(this.element, {
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

          switch (state.paymentMethodStatus) {
            case GlobalStatePaymentMethodStatus.CHALLENGE_REFUSED:
            case GlobalStatePaymentMethodStatus.CHALLENGE_ERROR:
            case GlobalStatePaymentMethodStatus.ERROR:
              if (state?.data?.status === 'cancel') {
                this.$timeout(() => {
                  this.$state.go(
                    '.',
                    {
                      paymentMethod: null,
                      paymentMethodId: null,
                      status: null,
                    },
                    {
                      location: 'replace',
                      reload: false,
                    },
                  );
                }, 0);
                return null;
              }
              this.onPaymentMethodAddError(state?.data?.message);
              return null;

            case GlobalStatePaymentMethodStatus.REGISTERED:
              return null;
            case GlobalStatePaymentMethodStatus.PAYMENT_METHOD_SAVED:
              this.teardownPaymentAdd();
              this.onPaymentMethodAdded();
              return null;

            default:
              return null;
          }
        },
        subsidiary: this.user.ovhSubsidiary,
        language: this.userLocale,
        hostApp: 'manager',
        eventBus: this.element,
      },
    });
  }
}
