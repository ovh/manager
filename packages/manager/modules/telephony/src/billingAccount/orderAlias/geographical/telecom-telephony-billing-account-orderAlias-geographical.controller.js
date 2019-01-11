angular.module('managerApp').controller('TelecomTelephonyAliasOrderGeographicalCtrl', function ($q, $translate, $stateParams, OvhApiTelephony, OvhApiOrder, TelecomTelephonyBillingAccountOrderAliasService, TucToast, TucToastError, TELEPHONY_NUMBER_OFFER) {
  const self = this;

  /**
   * Get a preselection of specific numbers
   * @param  {String} country be | ch | de | es | fr | gb
   * @return {Promise}
   */
  function getSpecificNumbers(country, zone) {
    if (country && zone) {
      return OvhApiTelephony.Number().Aapi().orderableByRange({
        country,
        billingAccount: $stateParams.billingAccount,
        type: 'geographic',
        range: zone,
      }).$promise.then(
        (data) => {
          self.predefinedNumbers = data.pool;
          self.prices = data.prices;
          self.contracts = data.contracts;
          _.mapKeys(self.prices, (value, name) => {
            self.prices[name].title = $translate.instant(['telephony', 'order', 'number', 'type', name, 'label'].join('_'));
          });
          if (self.predefinedNumbers) {
            self.form.premium = _.first(self.predefinedNumbers.premium);
            self.form.common = _.first(self.predefinedNumbers.common);
          }
          return data;
        },
        (err) => {
          TucToastError($translate.instant('telephony_order_specific_numbers_error'));
          return $q.reject(err);
        },
      );
    }
    return $q.reject();
  }

  /*= =============================
  =            EVENTS            =
  ============================== */

  /**
   * Get the list of specific zones
   * @param {String} country be | ch | de | es | fr | gb
   * @returns {Promise}
   */
  this.getGeographicalZone = function (axiom) {
    return OvhApiTelephony.Number().v6().getDetailedZones(
      {
        country: self.user.country,
        axiom,
      },
      null,
    ).$promise.then(zones => zones);
  };

  /**
   * When quantity changes
   */
  this.changeQty = function () {
    this.form.pool = this.form.amount.value;
    this.form.numberType = this.form.amount.value === 1 ? this.form.numberType : 'common';
  };

  /**
   * Invoked when the geographical zone change
   */
  this.changeZone = function () {
    this.loading.numbers = true;
    getSpecificNumbers(self.user.country, self.form.zone.city).finally(() => {
      self.loading.numbers = false;
    });
  };

  /**
   * Get the Total of the order
   * @returns {String}
   */
  this.getTotal = function () {
    const count = this.form.amount.value;
    if (this.prices) {
      const price = this.prices[this.form.numberType].withTax.text;
      return price.replace(/^([\d.,]*)/, forOne => forOne * count);
    }
    return null;
  };

  /**
   * Launch the order process
   * @returns {Promise}
   */
  this.order = function () {
    this.loading.order = true;
    let filter = [
      'city',
      'displayUniversalDirectory',
      'email',
      'firstname',
      'legalform',
      'name',
      'phone',
      'pool',
      'retractation',
      'streetName',
      'zip',
    ];
    if (this.form.legalform === 'corporation') {
      filter = filter.concat([
        'ape',
        'organisation',
        'siret',
        'socialNomination',
      ]);
    }
    const form = _.pick(this.form, filter);
    form.offer = 'alias';
    form.country = self.user.country;
    form.zone = _.get(this.form, 'zone.city');

    if (form.pool === 1) {
      delete form.pool;
    }
    if (!form.pool) {
      form.specificNumber = this.form[this.form.numberType];
    }
    OvhApiOrder.Telephony().v6().orderNumberGeographical(
      {
        billingAccount: $stateParams.billingAccount,
      },
      form,
    ).$promise.then(
      (response) => {
        self.orderInformations = response;
        TucToast.success($translate.instant('telephony_order_geographical_order_success'));
        self.orderDone = true;
        return response;
      },
      (err) => {
        self.loading.order = false;
        if (err && err.data && err.data.message) {
          switch (err.data.message) {
            case /^Invalid city parameter \(([^)]*)\)/.test(err.data.message) ? err.data.message : false:
              TucToast.error($translate.instant('telephony_order_order_error_city', form));
              break;
            case /^The following specified number is not longer available/.test(err.data.message) ? err.data.message : false:
              TucToast.error($translate.instant('telephony_order_order_error_available'));
              delete self.loading.order;
              break;
            default:
              TucToast.error($translate.instant('telephony_order_geographical_order_error'));
          }
        } else {
          TucToast.error($translate.instant('telephony_order_geographical_order_error'));
        }
        return $q.reject(err);
      },
    );
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  /**
   * Controller initialization
   */
  function init() {
    self.billingAccount = $stateParams.billingAccount;
    self.loading = {
      init: true,
    };

    self.preAmount = TELEPHONY_NUMBER_OFFER.preAmount.map(elt => ({
      label: $translate.instant(elt.label, elt),
      value: elt.value,
    }));

    self.form = {
      amount: _.find(
        self.preAmount,
        {
          value: 1,
        },
      ),
      numberType: 'common',
      retractation: false,
      pool: 1,
      legalform: 'individual',
      displayUniversalDirectory: false,
    };

    return TelecomTelephonyBillingAccountOrderAliasService.getUser()
      .then((user) => {
        self.user = user;
        self.form.email = user.email;
        self.form.firstname = user.firstname;
        self.form.name = user.name;
        self.form.legalform = user.legalform;
        self.form.organisation = user.organisation;
        return user;
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  init();
});
