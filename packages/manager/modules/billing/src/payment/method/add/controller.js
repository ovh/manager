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
    const element = document.getElementById('billing-payment-method-add');

    this.setupPaymentAdd(element, {
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

          console.log('state', state);

          switch (state.paymentMethodStatus) {
            case GlobalStatePaymentMethodStatus.PROCESSING:
              return 'Traitement en cours…';

            case GlobalStatePaymentMethodStatus.PENDING:
              return 'En attente d’une action utilisateur';

            case GlobalStatePaymentMethodStatus.CHALLENGE_WAITING:
              return 'Validation requise (3DS / challenge PSP)';

            case GlobalStatePaymentMethodStatus.CHALLENGE_OK:
              return 'Challenge validé avec succès';

            case GlobalStatePaymentMethodStatus.CHALLENGE_CANCELED:
              return 'Challenge annulé par l’utilisateur';

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
        eventBus: element,
      },
    });
  }
}
