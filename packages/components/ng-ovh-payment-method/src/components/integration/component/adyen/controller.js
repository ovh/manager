import AdyenCheckout from '@adyen/adyen-web';

import AdyenService from './service';

import {
  ADYEN_CONFIG,
  ADYEN_RESULT_CODE,
  PAYMENT_METHOD_BRANDS,
  PAYMENT_ADYEN_LIVE_IN_CONFIG_FEATURE_ID,
} from './constants';
import { AVAILABLE_CALLBACK_STATUS_ENUM } from '../../constants';

export default class OvhPaymentMethodIntegrationComponentAdyenCtrl {
  /* @ngInject */
  constructor(
    $location,
    $timeout,
    $translate,
    ovhFeatureFlipping,
    ovhPaymentMethod,
    OVH_PAYMENT_METHOD_INTEGRATION_TYPE,
  ) {
    this.$location = $location;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.TYPE_INTEGRATION_ENUM = OVH_PAYMENT_METHOD_INTEGRATION_TYPE;
  }

  $onInit() {
    if (this.initialParams) {
      this.ovhFeatureFlipping
        .checkFeatureAvailability(PAYMENT_ADYEN_LIVE_IN_CONFIG_FEATURE_ID)
        .then((featureAvailability) =>
          featureAvailability.isFeatureAvailable(
            PAYMENT_ADYEN_LIVE_IN_CONFIG_FEATURE_ID,
          ),
        )
        .then((adyenLiveInAvailability) => {
          this.adyenEnvironment = adyenLiveInAvailability
            ? ADYEN_CONFIG.ENV_ENUM.LIVE_IN
            : ADYEN_CONFIG.ENV_ENUM.LIVE;
          this.initializeComponent();
        });
    }

    // manage status from callback url
    const { callbackStatusParamUrlName } = this.componentCtrl.integrationCtrl;
    const callback = this.callback || this.$location.search();
    const status = callback[callbackStatusParamUrlName];
    if (status && AdyenService.hasCallbackUrlParams(callback)) {
      const callbackParams = {
        redirectResult: callback.redirectResult,
        paymentMethodId: callback.paymentMethodId,
        transactionId: callback.transactionId,
      };
      this.handleRedirectCallback(status, callbackParams);
    }
  }

  $onDestroy() {
    this.checkout = null;
    this.isComponentLoaded = false;
  }

  /* Component related methods */

  initializeComponent() {
    Object.assign(
      ADYEN_CONFIG.DEFAULT.paymentMethodsResponse.paymentMethods[0],
      {
        brands:
          PAYMENT_METHOD_BRANDS[
            this.initialParams.paymentMethod.type.paymentType
          ],
      },
    );
    const adyenConfiguration = {
      onChange: (state) => {
        this.$timeout(() => {
          this.isComponentLoaded = true;
          this.state = state;
          this.isInputsValid = state.isValid;
        });
      },
      onAdditionalDetails: this.handleAdditionalDetails.bind(this),
      ...ADYEN_CONFIG.DEFAULT,
      ...(this.initialParams
        ? {
            clientKey: this.initialParams.paymentMethod.merchantId,
            locale: this.ovhPaymentMethod.getUserLocale(),
          }
        : {}),
      environment: ADYEN_CONFIG.CLIENT_KEY_ENV_PATTERNS.test(
        this.initialParams.paymentMethod.merchantId,
      )
        ? ADYEN_CONFIG.ENV_ENUM.TEST
        : this.adyenEnvironment,
      redirectFromTopWhenInIframe: true,
    };

    this.createAdyenComponent(adyenConfiguration);

    this.hasSubmitted = false;
    this.transactionId = null;
  }

  createAdyenComponent(adyenConfiguration) {
    this.$timeout().then(() => {
      AdyenCheckout(adyenConfiguration).then((checkout) => {
        this.checkout = checkout;
        this.checkout
          .create('card', {
            ...AdyenService.parseFormSessionId(
              this.initialParams.paymentMethod.formSessionId,
            ),
            showBrandsUnderCardNumber: true,
          })
          .mount('#adyen-component-container');
      });
    });
  }

  submit() {
    const adyenPostParams = AdyenService.constructPostParams(this.state);

    this.hasSubmitted = true;

    return this.componentCtrl.integrationCtrl
      .onIntegrationSubmit({
        adyenPostParams,
      })
      .then((paymentMethod) => {
        const responseAdditionalActions = AdyenService.parseFormSessionId(
          paymentMethod.formSessionId,
        );

        if (responseAdditionalActions.action) {
          this.transactionId = paymentMethod.transactionId;
          this.handlePaymentMethodResponse(paymentMethod);
        } else {
          this.componentCtrl.integrationCtrl.manageCallback('onSubmitSuccess');
        }
      })
      .catch(() => {
        this.$timeout(() => {
          this.hasSubmitted = false;
        });
      });
  }

  handleAdditionalAction(formSessionIdObject) {
    this.checkout
      .createFromAction(formSessionIdObject.action)
      .mount('#adyen-additional-action-container');
  }

  handlePaymentMethodResponse(paymentMethodResponse) {
    this.paymentMethodId = paymentMethodResponse.paymentMethodId;

    this.handleAdditionalAction(
      AdyenService.parseFormSessionId(paymentMethodResponse.formSessionId),
    );
  }

  handleAdditionalDetails(state) {
    return this.setDetails(
      state.data.details,
      this.paymentMethodId,
      this.transactionId,
    );
  }

  handleDetailsResult(detailsResult) {
    const formSessionIdObject = AdyenService.parseFormSessionId(
      detailsResult.formSessionId,
    );

    if (formSessionIdObject.action) {
      this.handleAdditionalAction(formSessionIdObject);
    } else {
      this.handleResponse(formSessionIdObject, detailsResult.paymentMethodId);
    }
  }

  /* Redirect callback method */
  handleRedirectCallback(status, callbackParams) {
    const { paymentMethodId, transactionId } = callbackParams;

    const detailsParams = {
      redirectResult: decodeURI(callbackParams.redirectResult),
    };
    switch (status) {
      case AVAILABLE_CALLBACK_STATUS_ENUM.CANCEL:
      case AVAILABLE_CALLBACK_STATUS_ENUM.ERROR:
      case AVAILABLE_CALLBACK_STATUS_ENUM.FAILURE:
        this.componentCtrl.integrationCtrl.manageCallback('onSubmitError', {
          error: {
            context: this.TYPE_INTEGRATION_ENUM.COMPONENT.toLowerCase(),
            status,
            statusText: status.toUpperCase(),
            data: {
              message: this.$translate.instant(
                'ovh_payment_method_integration_component_adyen_redirect_error',
              ),
            },
          },
        });
        break;
      case AVAILABLE_CALLBACK_STATUS_ENUM.SUCCESS:
      default:
        return this.setDetails(detailsParams, paymentMethodId, transactionId);
    }

    return null;
  }

  /* Global method */
  setDetails(details, paymentMethodId, transactionId) {
    return this.ovhPaymentMethod
      .addPaymentDetails(paymentMethodId, {
        transactionId: parseInt(transactionId, 10),
        details: AdyenService.convertToBase64(JSON.stringify(details)),
      })
      .then((detailsResponse) => {
        this.handleDetailsResult(detailsResponse);
      })
      .catch((error) => {
        this.componentCtrl.integrationCtrl.manageCallback('onSubmitError', {
          error,
        });
      });
  }

  handleResponse(response, paymentMethodId) {
    let callbackFnName;
    let callbackParamObject = {};
    switch (response.resultCode) {
      case ADYEN_RESULT_CODE.AUTHORIZED:
        callbackFnName = 'onSubmitSuccess';
        callbackParamObject = {
          paymentMethodId,
        };
        break;

      case ADYEN_RESULT_CODE.ERROR:
      case ADYEN_RESULT_CODE.REFUSED:
        callbackFnName = 'onSubmitError';
        callbackParamObject = {
          error: {
            data: { message: response.refusalReason },
          },
        };
        this.$timeout(() => {
          this.hasSubmitted = false;
        });
        break;
      default:
        this.$timeout(() => {
          this.hasSubmitted = false;
        });
        break;
    }

    this.componentCtrl.integrationCtrl.manageCallback(
      callbackFnName,
      callbackParamObject,
    );
  }
}
