import {
  GlobalStateComponentStatus,
  GlobalStatePaymentMethodStatus,
} from './constants';

export default class PaymentMethodAddController {
  /* @ngInject */
  constructor($location, $timeout, coreConfig) {
    this.$location = $location;
    this.$timeout = $timeout;
    this.user = coreConfig.getUser();
    this.userLocale = coreConfig.getUserLocale();
    this.hostname = window.location.hostname;
    this.isProcessingCallback = false;
    this.hasProcessedCallback = false;
  }

  $onInit() {
    const element = document.getElementById('billing-payment-method-add');

    // Check if we have callback query parameters (returning from redirect)
    const queryParams = this.$location.search();
    const hasCallbackParams =
      queryParams.status ||
      queryParams.paymentMethodId ||
      queryParams.redirectResult ||
      queryParams.transactionId;

    if (hasCallbackParams) {
      // Mark that we're processing a callback to prevent premature redirects
      this.isProcessingCallback = true;
      // Store the original URL to preserve query parameters
      this.originalCallbackUrl = window.location.href;
    }

    // Wait for next tick to ensure element is ready and prevent race conditions
    // This allows the WillPayment module to initialize and read query parameters
    this.$timeout(() => {
      if (!element) {
        return;
      }

      this.setupPaymentAdd(element, {
        configuration: {
          baseUrl: window.location.origin,
          onChange: (state) => {
            if (
              state?.componentStatus ===
                GlobalStateComponentStatus.REDIRECTION_NEEDED &&
              state?.data?.url &&
              window.top
            ) {
              window.top.location.href = state.data.url;
              return null;
            }

            // If we're processing a callback, mark it as processed
            if (this.isProcessingCallback) {
              this.hasProcessedCallback = true;
              this.isProcessingCallback = false;
            }

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
                // Delay the redirect to ensure callback processing is complete
                if (this.hasProcessedCallback) {
                  this.$timeout(() => {
                    this.onPaymentMethodAdded();
                  }, 100);
                  return null;
                }
                return this.onPaymentMethodAdded();

              default:
                throw new Error(`Unhandled payment method state: ${state}`);
            }
          },
          subsidiary: this.user.ovhSubsidiary,
          language: this.userLocale,
          hostApp: 'manager',
          eventBus: element,
        },
      });
    }, 0);

    // If we have callback params, monitor and preserve the URL
    // to ensure the WillPayment module can process them
    if (hasCallbackParams) {
      // Monitor for URL changes that might strip query parameters
      const checkUrlPreservation = () => {
        const currentUrl = window.location.href;
        // If query parameters were lost, restore them
        if (
          this.originalCallbackUrl &&
          currentUrl !== this.originalCallbackUrl &&
          !currentUrl.includes('status=') &&
          this.originalCallbackUrl.includes('status=')
        ) {
          // Restore the original URL with query parameters
          window.history.replaceState(null, '', this.originalCallbackUrl);
        }
      };

      // Check periodically to ensure query parameters are preserved
      const urlCheckInterval = setInterval(() => {
        checkUrlPreservation();
        // Stop checking after the callback has been processed
        if (this.hasProcessedCallback || !this.isProcessingCallback) {
          clearInterval(urlCheckInterval);
        }
      }, 50);

      // Clear interval after 3 seconds max to avoid infinite checking
      this.$timeout(() => {
        clearInterval(urlCheckInterval);
        if (!this.hasProcessedCallback) {
          this.isProcessingCallback = false;
        }
      }, 3000);
    }
  }
}
