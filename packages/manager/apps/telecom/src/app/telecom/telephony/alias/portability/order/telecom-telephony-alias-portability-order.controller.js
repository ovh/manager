angular.module('managerApp')
  .controller('TelecomTelephonyAliasPortabilityOrderCtrl',
    function ($q, $scope, $stateParams, $translate, moment, TelephonyMediator,
      OvhApiMe, OvhApiOrder, TucBankHolidays, TucToast, TELEPHONY_REPAYMENT_CONSUMPTION) {
      const self = this;

      // attributes shared by 'individual' and 'company' social reason
      const sharedAttributes = [
        'billingAccount', 'building', 'callNumber', 'city', 'comment', 'contactName',
        'contactNumber', 'country', 'desireDate', 'displayUniversalDirectory', 'door',
        'executeAsSoonAsPossible', 'firstName', 'floor', 'groupNumber', 'lineToRedirectAliasTo',
        'name', 'offer', 'socialReason', 'stair', 'streetName', 'streetNumber', 'streetNumberExtra',
        'streetType', 'type', 'zip',
      ];

      function init() {
        self.order = {
          // default values
          executeAsSoonAsPossible: true,
          type: 'landline',
          sdatype: 'all',
          socialReason: 'individual',
          country: 'france',
          contactNumber: '',
          translatedCountry: $translate.instant('telephony_alias_portability_order_contact_country_france'),
          displayUniversalDirectory: false,
          numbersList: [],
          success: false,
          autoPay: false,
          addressTooLong: false,
        };

        self.stepsList = ['number', 'contact', 'config', 'summary'];
        self.step = 'number';
        self.minDate = moment().add(15, 'days').toDate();
        self.order.desireDate = moment(self.minDate).toDate();
        self.desireDatePickerOpened = false;
        self.isSDA = false;

        // reset contract when step changes
        $scope.$watch('PortabilityOrderCtrl.step', () => {
          self.order.isContractsAccepted = false;
        });

        $scope.$watch('PortabilityOrderCtrl.order', () => {
          self.order.contactName = self.order.name;
        }, true);

        $scope.$watch('PortabilityOrderCtrl.isSDA', () => {
          self.order.offer = self.isSDA ? 'company' : 'individual';
        }, true);

        self.isSpecialNumber = false;
        self.typologies = { france: [], belgium: [] };

        self.datePickerOptions = {
          minDate: self.minDate,
          dateDisabled(dateAndMode) {
            const isBankHoliday = TucBankHolidays.checkIsBankHoliday('FR', dateAndMode.date);
            return ((dateAndMode.mode === 'day' && (dateAndMode.date.getDay() === 0
                  || dateAndMode.date.getDay() === 6))
                || (isBankHoliday));
          },
        };

        // fetch list of billing accounts
        return TelephonyMediator.getAll().then((groups) => {
          self.billingAccounts = groups;
          self.order.billingAccount = $stateParams.billingAccount;
        }).catch((err) => {
          TucToast.error(_.get(err, 'data.message'));
          return $q.reject(err);
        }).then(() => OvhApiOrder.v6().schema().$promise.then((schema) => {
          if (schema && schema.models['telephony.NumberSpecialTypologyEnum'] && schema.models['telephony.NumberSpecialTypologyEnum'].enum) {
            const typologies = _.map(schema.models['telephony.NumberSpecialTypologyEnum'].enum, typo => ({
              value: typo,
              label: $translate.instant(`telephony_order_specific_typology_${typo.replace(new RegExp('^be_|fr_'), '')}_label`),
            }));

            self.typologies.france = _.filter(typologies, typo => _.startsWith(typo.value, 'fr_'));
            self.typologies.belgium = _.filter(typologies, typo => _.startsWith(typo.value, 'be_'));
            return self.typologies;
          }

          TucToast.error($translate.instant('telephony_order_specific_typology_error'));
          return $q.reject();
        }).catch((error) => {
          TucToast.error($translate.instant('telephony_order_specific_typology_error'));
          return $q.reject(error);
        }));
      }

      self.onSDATypeChange = function () {
        self.order.socialReason = self.isSDA ? 'corporation' : 'individual';
      };

      self.openDesireDatePicker = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        self.desireDatePickerOpened = true;
      };

      // select number corresponding country automatically
      self.onNumberChange = function () {
        const number = self.normalizeNumber(self.order.callNumber);
        if (_.startsWith(number, '0033')) {
          self.order.country = 'france';
        } else if (_.startsWith(number, '0032')) {
          self.order.country = 'belgium';
          self.order.rio = null;
        } else if (_.startsWith(number, '0041')) {
          self.order.country = 'switzerland';
          self.order.rio = null;
        }

        // handle special number
        self.isSpecialNumber = _.some(
          TELEPHONY_REPAYMENT_CONSUMPTION.specialNumberPrefix[self.order.country],
          prefix => _.startsWith(number, prefix),
        );
        self.order.specialNumberCategory = self.isSpecialNumber
          ? _.first(self.typologies[self.order.country]).value : null;
        self.order.type = self.isSpecialNumber ? 'special' : 'landline';

        self.order.translatedCountry = $translate.instant(`telephony_alias_portability_order_contact_country_${self.order.country}`);
      };

      self.onChooseRedirectToLine = function (result) {
        self.order.lineToRedirectAliasTo = result.serviceName;
        self.order.lineToRedirectAliasToDescription = result.description;
      };

      // add sdaNumberToAdd number to numbersList
      self.addSdaNumber = function () {
        self.order.numbersList.push(self.order.sdaNumberToAdd);
        self.order.numbersList = _.uniq(self.order.numbersList);
        self.order.sdaNumberToAdd = null;
      };

      // remove given number from numbersList
      self.removeSdaNumber = function (number) {
        self.order.numbersList = _.pull(self.order.numbersList, number);
      };

      // normalize number : replace +33 by 0033
      self.normalizeNumber = function (numberParam) {
        let number = numberParam;
        if (number) {
          number = number.replace(/^\+/, '00');
        }
        return number;
      };

      self.goToConfigStep = function () {
        self.order.addressTooLong = false;

        if (`${_.get(self.order, 'streetName', '')}${_.get(self.order, 'streetNumber', '')}${_.get(self.order, 'streetNumberExtra', '')}${_.get(self.order, 'streetType', '')}`.length >= 35) {
          self.order.addressTooLong = true;
          return false;
        }

        self.step = 'config';
        return true;
      };

      self.getOrderParams = function () {
        let params = _.pick(self.order, sharedAttributes);

        if (params.offer === 'individual') {
          params = _.assign(params, _.pick(self.order, 'rio'));
        } else {
          params = _.assign(params, _.pick(self.order, 'siret'));
        }
        params.firstName = params.firstName || '';

        if (self.isSDA && self.order.sdatype === 'select' && self.order.numbersList.length) {
          params.listNumbers = _.map(self.order.numbersList, self.normalizeNumber).join(',');
        }

        if (self.isSpecialNumber) {
          params.specialNumberCategory = self.order.specialNumberCategory.replace('fr_', '');
        }

        if (params.country === 'france') {
          params.fiabilisation = self.order.sdatype === 'all';
        }

        params.callNumber = self.normalizeNumber(params.callNumber);
        params.contactNumber = self.normalizeNumber(params.contactNumber);
        params.desireDate = moment(params.desireDate).format('Y-MM-DD');

        return params;
      };

      self.fetchPriceAndContracts = function () {
        self.step = 'summary';
        return OvhApiOrder.Telephony().v6()
          .getPortability(self.getOrderParams()).$promise
          .then(({ details, contracts, prices }) => {
            self.details = details;
            self.contracts = contracts;
            self.prices = prices;
          })
          .catch((err) => {
            self.step = 'number';
            TucToast.error(_.get(err, 'data.message', ''));
            return $q.reject(err);
          });
      };

      self.submitOrder = function () {
        self.order.isOrdering = true;
        return OvhApiOrder.Telephony().v6().orderPortability({
          billingAccount: self.order.billingAccount,
        }, _.omit(self.getOrderParams(), 'billingAccount')).$promise.then(({ orderId, url }) => {
          self.order.success = true;
          self.order.url = url;
          return OvhApiMe.Order().v6().get({
            orderId,
          }).$promise.then(
            () => OvhApiMe.Order().v6().payRegisteredPaymentMean({
              orderId,
            }, {
              paymentMean: 'ovhAccount',
            }).$promise.then(() => {
              self.order.autoPay = true;
            }, () => {
            // if it fails no need to reject because portablity order is a success
            // and validation can always be done by clicking
              self.order.autoPay = false;
            }),
            () => {
              // in this case it means that nic bill and connected are not the same
              // so display a message telling that order must be validated by clicking
              // no need to reject because portablity order is a success
              // and validation can always be done by clicking
              self.order.autoPay = false;
            },
          );
        }).catch((err) => {
          TucToast.error(`${$translate.instant('telephony_alias_portability_order_error')} ${_.get(err, 'data.message')}`);
          return $q.reject(err);
        }).finally(() => {
          self.order.isOrdering = false;
        });
      };

      init();
    });
