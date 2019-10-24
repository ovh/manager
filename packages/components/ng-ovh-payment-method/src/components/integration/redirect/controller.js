import get from 'lodash/get';

import {
  AVAILABLE_CALLBACK_STATUS_ENUM,
} from '../constants'; // from integration constants

import {
  TYPE_INTEGRATION_ENUM,
} from '../../../payment-method.constants';

export default class OvhPaymentMethodIntegrationRedirectCtrl {
  /* @ngInject */
  constructor($location, $window) {
    this.$location = $location;
    this.$window = $window;
  }

  submit() {
    return this.integrationCtrl
      .onIntegrationSubmit()
      .then((response) => {
        const { paymentMethodType } = this.integrationCtrl;

        if (paymentMethodType.integration === TYPE_INTEGRATION_ENUM.REDIRECT && response.url) {
          this.$window.location = response.url;
        }
        return response;
      });
  }

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    // manage status from callback url
    const callbackStatus = get(
      this.$location.search(),
      this.integrationCtrl.callbackStatusParamUrlName,
    );

    if (callbackStatus) {
      switch (callbackStatus) {
        case AVAILABLE_CALLBACK_STATUS_ENUM.CANCEL:
        case AVAILABLE_CALLBACK_STATUS_ENUM.ERROR:
        case AVAILABLE_CALLBACK_STATUS_ENUM.FAILURE:
          this.integrationCtrl.manageCallback('onSubmitError', {
            error: {
              context: 'redirect',
              status: callbackStatus,
              statusText: callbackStatus.toUpperCase(),
              data: {
                message: `Payment method registration redirect respond with ${callbackStatus} status.`,
              },
            },
          });
          break;
        default:
          this.integrationCtrl.manageCallback('onSubmitSuccess', {
            status: callbackStatus,
            paymentMethodId: get(this.$location.search(), 'paymentMethodId'),
          });
          break;
      }
    }

    return this.integrationCtrl.onIntegrationInitialized(this.submit.bind(this));
  }

  /* -----  End of Hooks  ------ */
}
