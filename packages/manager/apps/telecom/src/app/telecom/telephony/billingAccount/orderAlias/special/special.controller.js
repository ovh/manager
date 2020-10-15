import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import head from 'lodash/head';
import map from 'lodash/map';
import pick from 'lodash/pick';

import { TELEPHONY_NUMBER_OFFER } from '../order-alias.constant';

export default /* @ngInject */ function TelecomTelephonyAliasOrderSpecialCtrl(
  $q,
  $translate,
  $stateParams,
  OvhApiTelephony,
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
  function getSpecificNumbers(country, range) {
    return OvhApiTelephony.Number()
      .Aapi()
      .orderableByRange({
        country,
        billingAccount: $stateParams.billingAccount,
        type: 'special',
        range,
      })
      .$promise.then(
        (data) => {
          self.predefinedNumbers = data.pool;
          self.prices = data.prices;
          self.contracts = data.contracts;
          forEach(Object.keys(self.prices), (name) => {
            self.prices[name].title = $translate.instant(
              ['telephony', 'order', 'number', 'type', name, 'label'].join('_'),
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

  function getTypologies(country) {
    return OvhApiOrder.v6()
      .schema()
      .$promise.then(
        (schema) => {
          if (
            schema &&
            schema.models['telephony.NumberSpecialTypologyEnum'] &&
            schema.models['telephony.NumberSpecialTypologyEnum'].enum
          ) {
            const typologies = filter(
              schema.models['telephony.NumberSpecialTypologyEnum'].enum,
              (elt) => elt.match(new RegExp(`^${country}_`)),
            );
            self.typologies = map(typologies, (typo) => ({
              value: typo,
              label: $translate.instant(
                `telephony_alias_special_rsva_infos_typology_${typo.replace(
                  new RegExp(`^${country}_`),
                  '',
                )}_label`,
              ),
            }));
            return self.typologies;
          }
          TucToast.error(
            $translate.instant(
              'telephony_alias_special_rsva_infos_typology_error',
            ),
          );
          return $q.reject('No typology');
        },
        (err) => {
          TucToast.error(
            $translate.instant(
              'telephony_alias_special_rsva_infos_typology_error',
            ),
          );
          return $q.reject(err);
        },
      );
  }

  function getRanges(country) {
    return OvhApiTelephony.Number()
      .v6()
      .getRanges({
        country,
      })
      .$promise.then(
        (ranges) => {
          self.ranges = map(ranges, (elt) => ({
            label: elt,
            value: elt,
          }));
          return self.ranges;
        },
        (err) => {
          TucToast.error(
            $translate.instant('telephony_order_special_range_error'),
          );
          $q.reject(err);
        },
      );
  }

  /*= =============================
    =            EVENTS            =
    ============================== */

  /**
   * When quantity changes
   */
  this.changeQty = function changeQty() {
    this.form.pool = this.form.amount.value;
    this.form.numberType =
      this.form.amount.value === 1 ? this.form.numberType : 'common';
  };

  /**
   * Invoked when the range changes
   */
  this.changeRange = function changeRange() {
    this.loading.numbers = true;
    this.form.range = this.form.numberRange.value;
    getSpecificNumbers(self.user.country, this.form.range).finally(() => {
      self.loading.numbers = false;
    });
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
   * Launch the order process
   * @returns {Promise}
   */
  this.order = function order() {
    this.loading.order = true;
    const fields = [
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
      'typology',
      'range',
      'ape',
      'organisation',
      'siret',
      'socialNomination',
    ];
    const form = pick(this.form, fields);
    form.country = self.user.country;
    if (form.pool === 1) {
      delete form.pool;
    }
    if (!form.pool) {
      form.specificNumber = this.form[this.form.numberType];
    }
    OvhApiOrder.Telephony()
      .v6()
      .orderNumberSpecial(
        {
          billingAccount: $stateParams.billingAccount,
        },
        form,
      )
      .$promise.then(
        (response) => {
          self.orderInformations = response;
          TucToast.success(
            $translate.instant('telephony_order_special_order_success'),
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
                  $translate.instant('telephony_order_special_order_error'),
                );
            }
          } else {
            TucToast.error(
              $translate.instant('telephony_order_special_order_error'),
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
      legalform: 'corporation',
      displayUniversalDirectory: false,
    };

    return TelecomTelephonyBillingAccountOrderAliasService.getUser()
      .then((user) => {
        self.user = user;
        self.form.email = user.email;
        self.form.firstname = user.firstname;
        self.form.name = user.name;
        self.form.organisation = user.organisation;
        return $q.all([getRanges(user.country), getTypologies(user.country)]);
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  init();
}
