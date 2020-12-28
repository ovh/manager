import find from 'lodash/find';
import forEach from 'lodash/forEach';
import head from 'lodash/head';
import map from 'lodash/map';
import pick from 'lodash/pick';

import { TELEPHONY_NUMBER_OFFER } from '../order-alias.constant';

export default /* @ngInject */ function TelecomTelephonyAliasOrderInternationalCtrl(
  $q,
  $translate,
  $stateParams,
  OvhApiTelephony,
  OvhApiTelephonyNumber,
  OvhApiOrder,
  TelecomTelephonyBillingAccountOrderAliasService,
  TucToast,
  TucToastError,
) {
  const self = this;

  /**
   * Get a preselection of specific numbers
   * @param  {String} country be | ch | de | es | fr | gb
   * @return {Promise}
   */
  function getSpecificNumbers(country, zone) {
    if (country && zone) {
      return OvhApiTelephony.Number()
        .Aapi()
        .orderableByRange({
          country,
          billingAccount: $stateParams.billingAccount,
          type: 'international',
          range: zone,
        })
        .$promise.then(
          (data) => {
            self.predefinedNumbers = data.pool;
            self.prices = data.prices;
            self.contracts = data.contracts;
            forEach(Object.keys(self.prices), (name) => {
              self.prices[name].title = $translate.instant(
                ['telephony', 'order', 'number', 'type', name, 'label'].join(
                  '_',
                ),
              );
            });
            if (self.predefinedNumbers) {
              self.form.premium = head(self.predefinedNumbers.premium);
              self.form.common = head(self.predefinedNumbers.common);
            }
            return data;
          },
          (err) => {
            TucToastError(
              $translate.instant('telephony_order_specific_numbers_error'),
            );
            return $q.reject(err);
          },
        );
    }
    return $q.reject();
  }

  /*= =============================
    =            EVENTS            =
    ============================== */

  this.resetZone = function resetZone(country) {
    this.form.country = country.code;
    delete this.form.zone;
  };

  /**
   * Get the Total of the order
   * @returns {String}
   */
  this.getTotal = function getTotal() {
    const count = this.form.amount.value;
    if (this.prices) {
      const price = this.prices[this.form.numberType].withTax.text;
      return price.replace(/^([\d.,]*)/, (forOne) => forOne * count);
    }
    return null;
  };

  /**
   * When quantity changes
   */
  this.changeQty = function changeQty() {
    this.form.pool = this.form.amount.value;
    this.form.numberType =
      this.form.amount.value === 1 ? this.form.numberType : 'common';
  };

  this.changeZone = function changeZone() {
    this.loading.init = true;
    getSpecificNumbers(self.form.country, self.form.zone).finally(() => {
      self.loading.init = false;
    });
  };

  /**
   * Get the list of specific zones
   * @param {String} country be | ch | de | es | fr | gb
   * @returns {Promise}
   */
  this.getGeographicalZone = function getGeographicalZone(axiom) {
    return OvhApiTelephonyNumber.v6()
      .getZones(
        {
          country: self.form.country,
          axiom,
        },
        null,
      )
      .$promise.then((zones) => zones);
  };

  /**
   * Launch the order process
   * @returns {Promise}
   */
  this.order = function order() {
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
      'zone',
      'country',
    ];
    if (this.form.legalform === 'corporation') {
      filter = filter.concat([
        'ape',
        'organisation',
        'siret',
        'socialNomination',
      ]);
    }
    const form = pick(this.form, filter);
    form.offer = 'alias';

    if (form.pool === 1) {
      delete form.pool;
    }
    if (!form.pool) {
      form.specificNumber = this.form[this.form.numberType];
    }
    OvhApiOrder.Telephony()
      .v6()
      .orderNumberGeographical(
        {
          billingAccount: self.billingAccount,
        },
        form,
      )
      .$promise.then(
        (response) => {
          self.orderInformations = response;
          TucToast.success(
            $translate.instant('telephony_order_international_order_success'),
          );
          self.orderDone = true;
          return response;
        },
        (err) => {
          self.loading.order = false;
          if (err && err.data && err.data.message) {
            switch (err.data.message) {
              case /^Invalid city parameter \(([^)]*)\)/.test(err.data.message)
                ? err.data.message
                : false:
                TucToast.error(
                  $translate.instant('telephony_order_order_error_city', form),
                );
                break;
              case /^The following specified number is not longer available/.test(
                err.data.message,
              )
                ? err.data.message
                : false:
                TucToast.error(
                  $translate.instant('telephony_order_order_error_available'),
                );
                delete self.loading.order;
                break;
              default:
                TucToast.error(
                  $translate.instant(
                    'telephony_order_international_order_error',
                  ),
                );
            }
          } else {
            TucToast.error(
              $translate.instant('telephony_order_international_order_error'),
            );
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

    self.preAmount = TELEPHONY_NUMBER_OFFER.preAmount.map((elt) => ({
      label: $translate.instant(elt.label, elt),
      value: elt.value,
    }));

    self.form = {
      amount: find(self.preAmount, {
        value: 1,
      }),
      numberType: 'common',
      retractation: false,
      pool: 1,
      displayUniversalDirectory: false,
    };

    $q.all([
      TelecomTelephonyBillingAccountOrderAliasService.getUser().then((user) => {
        self.user = user;
        self.form.email = user.email;
        self.form.firstname = user.firstname;
        self.form.name = user.name;
        self.form.legalform = user.legalform;
        self.form.organisation = user.organisation;
        return user;
      }),
      TelecomTelephonyBillingAccountOrderAliasService.getForeignCountries().then(
        (countries) => {
          self.countries = map(countries, (country) => {
            const countryFlag = country.toLowerCase() === 'uk' ? 'gb' : country;
            return {
              code: country,
              class: `flag-icon flag-icon-squared flag-icon-${countryFlag}`,
              name: $translate.instant(`country_${country.toUpperCase()}`),
            };
          });
        },
        (err) => {
          TucToastError(
            $translate.instant('telephony_order_international_countries_error'),
          );
          return $q.reject(err);
        },
      ),
    ]).finally(() => {
      self.loading.init = false;
    });
  }

  init();
}
