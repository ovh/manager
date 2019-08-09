/* eslint-disable class-methods-use-this */
angular.module('services').service(
  'BillingPaymentMethodService',
  class BillingPaymentMethod {
    constructor($q, $http, $timeout, $httpParamSerializerJQLike, MePaymentMethodApi,
      BillingVantivInstance, BILLING_PAYMENT_METHOD, BILLING_VANTIV) {
      this.$q = $q;
      this.$http = $http;
      this.$timeout = $timeout;
      this.$httpParamSerializerJQLike = $httpParamSerializerJQLike;
      this.MePaymentMethodApi = MePaymentMethodApi;
      this.BillingVantivInstance = BillingVantivInstance;
      this.BILLING_PAYMENT_METHOD = BILLING_PAYMENT_METHOD;
      this.BILLING_VANTIV = BILLING_VANTIV;

      this.cardTypes = {
        VISA: 'VISA',
        AMERICAN_EXPRESS: 'AMEX',
        MASTERCARD: 'MASTERCARD',
      };
    }

    filterByValidStatus(paymentMethods) {
      return _.filter(paymentMethods, 'status', 'VALID');
    }

    filterOnlyOneWithId(paymentMethods) {
      return _.filter(paymentMethods, paymentMethod => _.has(paymentMethod, 'id'));
    }

    _pickAvailablePaymentTypes(data) {
      return _.keys(_.pick(data, status => status === true));
    }

    _filterNonExcludedPaymentTypes(paymentTypes) {
      return _.filter(
        paymentTypes,
        paymentType => !_.includes(
          this.BILLING_PAYMENT_METHOD.EXCLUDED_AUTOMATIC_TYPES_FOR_CREATION,
          paymentType,
        ),
      );
    }

    _filterNonAngularValues(values) {
      return _.filter(values, value => !_.startsWith(value, '$'));
    }

    getAvailable() {
      return this.MePaymentMethodApi.get()
        .$promise.then(this.filterByValidStatus)
        .then(this.filterOnlyOneWithId);
    }

    create(paymentMethod) {
      return this.MePaymentMethodApi.create(paymentMethod).$promise;
    }

    delete(id) {
      return this.MePaymentMethodApi.delete({
        id,
      }).$promise;
    }

    update(id, description) {
      const data = { id };

      if (description) {
        data.description = description;
      }

      return this.MePaymentMethodApi.update(data).$promise;
    }

    extractPaymentMethodId(submitUrl) {
      const REGEX = /paymentMeanId=(\w+)/;
      const matches = REGEX.exec(submitUrl);

      if (matches.length === 2) {
        return matches[1];
      }

      return null;
    }

    submit(submitUrl, newPaymentMethod) {
      return this.$http({
        method: 'POST',
        url: submitUrl,
        data: this.$httpParamSerializerJQLike(newPaymentMethod),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    }

    pollStatusChanged(id, timeoutDate, initialStatus = 'CREATED') {
      return this.update(id).then((data) => {
        if (data.status === initialStatus) {
          if (timeoutDate.isAfter(new Date())) {
            // If status has not changed we need to try again but later
            const interval = this.BILLING_PAYMENT_METHOD.UPDATE_POLL.INTERVAL;
            return this.$timeout(() => this.pollStatusChanged(
              id,
              timeoutDate,
              initialStatus,
            ), interval);
          }

          return this.$q.reject({
            context: 'vantiv',
            message: "Payment method status couldn't be refreshed in the expected time.",
          });
        }
        return data;
      });
    }

    getVantivErrorCode(error) {
      const errorCode = _.get(error, 'response.response');

      if (errorCode) {
        return parseInt(errorCode, 10);
      }

      return null;
    }

    isCreditCardVantivError(error) {
      const errorCode = this.getVantivErrorCode(error);

      return _.includes(this.BILLING_VANTIV.CREDIT_CARD_ERRORS, errorCode);
    }

    isCardValidationNumberVantivError(error) {
      const errorCode = this.getVantivErrorCode(error);

      return _.includes(this.BILLING_VANTIV.CARD_VALIDATION_NUMBER_ERRORS, errorCode);
    }

    isIframeHtmlMissingVantivError(error) {
      const errorCode = this.getVantivErrorCode(error);

      return errorCode === this.BILLING_VANTIV.RESPONSES_CODE.EPROTECT_IFRAME_HTML_FAILED_TO_LOAD;
    }

    isIframeCssMissingVantivError(error) {
      const errorCode = this.getVantivErrorCode(error);

      return errorCode === this.BILLING_VANTIV.RESPONSES_CODE.EPROTECT_IFRAME_CSS_FAILED_TO_LOAD;
    }

    add(paymentMethod) {
      return this.create(paymentMethod).then(this.submitVantiv.bind(this));
    }

    submitVantiv(paymentMethod) {
      const id = _.get(paymentMethod, 'id');
      const submitUrl = _.get(paymentMethod, 'submitUrl');
      const paymentMethodId = this.extractPaymentMethodId(submitUrl);

      return this.BillingVantivInstance.submit(`payment_mean_${paymentMethodId}`)
        .then(response => this.submit(submitUrl, response))
        .then(() => {
          const timeoutDate = moment().add(this.BILLING_PAYMENT_METHOD.UPDATE_POLL.TIMEOUT, 'ms');
          return this.pollStatusChanged(id, timeoutDate);
        })
        .then((response) => {
          if (response.status !== 'VALID') {
            return this.$q.reject({ context: 'vantiv', message: 'Invalid card, please try with another one.' });
          }
          return response;
        })
        .then(() => ({
          paymentType: paymentMethod.paymentType,
          id,
        }))
        .catch(error => this.delete(id).finally(() => this.$q.reject(error)));
    }

    // Those rules came from https://en.wikipedia.org/wiki/Payment_card_number
    extractCreditCardCompany(cardNumber6And4) {
      if (!_.isString(cardNumber6And4)) {
        return null;
      }

      const firstTwoDigitsNumber = parseInt(cardNumber6And4.substr(0, 2), 10);
      const firstFourDigitsNumber = parseInt(cardNumber6And4.substr(0, 4), 10);

      if (_.startsWith(cardNumber6And4, '4')) {
        return this.cardTypes.VISA;
      }

      // Valid american_express should begin with a "." since API doesn't return a BIN number
      // for them (only last 4 digits)
      if (_.startsWith(cardNumber6And4, '.')) {
        return this.cardTypes.AMERICAN_EXPRESS;
      }

      if ((firstTwoDigitsNumber >= 51 && firstTwoDigitsNumber <= 55)
        || (firstFourDigitsNumber >= 2221 && firstFourDigitsNumber <= 2720)) {
        return this.cardTypes.MASTERCARD;
      }

      return null;
    }

    // Get details from a credit card number stored in 6.4 format XXXXXX.XXXX
    // where the first part is the first 6th digits and the second part is the
    // last 4th digits.
    extractCreditCardDetails(cardNumber6And4) {
      if (!cardNumber6And4 || _.isEmpty(cardNumber6And4)) {
        return null;
      }

      if (!_.isString(cardNumber6And4)) {
        throw new Error('Expect a card number stored in string');
      }

      const cardType = this.extractCreditCardCompany(cardNumber6And4);
      const splitCardNumber = cardNumber6And4.split('.');
      const lastDigits = splitCardNumber[1];
      let hiddenCardNumber = '';
      switch (cardType) {
        case this.cardTypes.VISA:
          hiddenCardNumber = `XXXX XXXX XXXX ${splitCardNumber[1]}`;
          break;
        case this.cardTypes.AMERICAN_EXPRESS:
          hiddenCardNumber = `XXXX XXXXXX X${splitCardNumber[1]}`;
          break;
        case this.cardTypes.MASTERCARD:
          hiddenCardNumber = `XXXX XXXX XXXX ${splitCardNumber[1]}`;
          break;
        default:
          throw new Error('Unrecognized card number.  Expected formats : XXXXXX.XXXX or .XXXX');
      }

      return {
        company: cardType,
        lastDigits: lastDigits[1],
        hiddenCardNumber,
      };
    }
  },
);
/* eslint-enable class-methods-use-this */
