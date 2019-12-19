import get from 'lodash/get';
import merge from 'lodash/merge';

angular.module('services').factory('BillingVantiv', ($q, BILLING_VANTIV) => class BillingVantiv {
  constructor(configuration) {
    if (angular.isUndefined(EprotectIframeClient)) {
      // This means we couldn"t download the eprotect-iframe-client javascript library
      throw new Error("Could not download the vantiv's eProtect javascript library.");
    }

    const DEFAULT_CONFIGURATION = {
      paypageId: 'ThwL3YY9YEnWXTFb',
      style: 'ovhcss',
      height: '300px',
      reportGroup: 'ovh.us',
      timeout: 15000,
      div: 'eProtectIframe',
      callback: (response) => this.eProtectClientCallback(response),

      // Expiration date
      months: {
        1: '01',
        2: '02',
        3: '03',
        4: '04',
        5: '05',
        6: '06',
        7: '07',
        8: '08',
        9: '09',
        10: '10',
        11: '11',
        12: '12',
      },
      numYears: 11,

      // Helpers
      tooltipText: 'A CVV is the 3 digit code on the back of your Visa, MasterCard and Discover or a 4 digit code on the front of your American Express',
      placeholderText: {
        cvv: 'CVV',
        accountNumber: 'Account Number',
      },

      // Behaviour
      showCvv: true,
      tabIndex: {
        cvv: 1,
        accountNumber: 2,
        expMonth: 3,
        expYear: 4,
      },
      enhancedUxFeatures: {
        inlineFieldValidations: true,
      },
    };

    this.eProtectClient = new EprotectIframeClient(merge(
      {},
      DEFAULT_CONFIGURATION,
      configuration,
    ));
    this.eProtectClient.autoAdjustHeight();

    this.deferredSubmit = $q.defer();
  }

  eProtectClientCallback(data) {
    const responseCode = parseInt(get(data, 'response', '-1'), 10);

    if (responseCode === BILLING_VANTIV.RESPONSES_CODE.SUCCESS) {
      this.deferredSubmit.resolve(data);
    } else {
      this.deferredSubmit.reject({
        context: 'vantiv',
        response: data,
      });
    }

    this.deferredSubmit = $q.defer();
  }

  submit(id) {
    const message = {
      id,
    };

    this.eProtectClient.getPaypageRegistrationId(message);

    return this.deferredSubmit.promise;
  }
});
