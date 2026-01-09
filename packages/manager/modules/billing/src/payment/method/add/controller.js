import { GlobalStatePaymentMethodStatus } from './constants';

export default class PaymentMethodAddController {
  /* @ngInject */
  constructor(coreConfig) {
    this.user = coreConfig.getUser();
    this.userLocale = coreConfig.getUserLocale();
    this.hostname = window.location.hostname;
  }

  $onInit() {
    const element = document.getElementById('billing-payment-method-add');

    this.setupPaymentAdd(element, {
      configuration: {
        baseUrl: window.location.href,
        onChange: (state) => {
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
              throw new Error(`Unhandled payment method state: ${state}`);

            case GlobalStatePaymentMethodStatus.REGISTERED:
            case GlobalStatePaymentMethodStatus.PAYMENT_METHOD_SAVED:
              return this.onPaymentMethodAdded();

            default:
              throw new Error(`Unhandled payment method state: ${state}`);
          }
        },
        subsidiary: this.user.ovhSubsidiary,
        language: this.userLocale,
        hostApp: 'manager',
        eventBus: Element,
      },
    });
  }
}
