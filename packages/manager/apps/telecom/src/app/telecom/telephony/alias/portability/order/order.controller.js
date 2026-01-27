import assign from 'lodash/assign';
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import pull from 'lodash/pull';
import some from 'lodash/some';
import startsWith from 'lodash/startsWith';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';

import { SPECIAL_NUMBER_PREFIX } from '../../special/repayments/repayments.constants';
import {
  REGEX,
  PORTABILITY_STREET_NUMBER_EXTRA_ENUM,
} from '../portabilities/portabilities.constants';

export default /* @ngInject */ function TelecomTelephonyAliasPortabilityOrderCtrl(
  $q,
  $scope,
  $stateParams,
  $timeout,
  $translate,
  moment,
  tucVoipBillingAccount,
  tucVoipService,
  OvhApiMe,
  OvhApiOrder,
  TelephonyPortabilitiesService,
  TucBankHolidays,
  TucToast,
  canOrderSpecialPortability,
  goToSvaWallet,
) {
  const self = this;

  // attributes shared by 'individual' and 'company' social reason
  const sharedAttributes = [
    'billingAccount',
    'building',
    'callNumber',
    'city',
    'comment',
    'contactName',
    'contactNumber',
    'country',
    'desireDate',
    'displayUniversalDirectory',
    'door',
    'executeAsSoonAsPossible',
    'firstName',
    'floor',
    'groupNumber',
    'lineToRedirectAliasTo',
    'name',
    'offer',
    'socialReason',
    'stair',
    'streetName',
    'streetNumber',
    'streetNumberExtra',
    'streetType',
    'type',
    'zip',
  ];

  function init() {
    self.canOrderSpecialPortability = canOrderSpecialPortability;
    self.goToSvaWallet = goToSvaWallet;
    self.regex = REGEX;

    self.order = {
      // default values
      executeAsSoonAsPossible: true,
      type: 'landline',
      sdatype: 'all',
      socialReason: 'individual',
      country: 'france',
      contactNumber: '',
      translatedCountry: $translate.instant(
        'telephony_alias_portability_order_contact_country_france',
      ),
      displayUniversalDirectory: false,
      numbersList: [],
      success: false,
      autoPay: false,
      addressTooLong: false,
    };
    self.autoCompleteCity = null;
    self.autoCompleteStreetName = null;
    self.countryCode = 'fr';
    self.streetNumberExtraEnum = PORTABILITY_STREET_NUMBER_EXTRA_ENUM.OTHER;

    self.minDate = moment()
      .add(15, 'days')
      .toDate();
    self.order.desireDate = moment(self.minDate).toDate();
    self.desireDatePickerOpened = false;
    self.isSDA = false;

    $scope.$watch(
      'PortabilityOrderCtrl.order',
      () => {
        self.order.contactName = self.order.name;
      },
      true,
    );

    $scope.$watch(
      'PortabilityOrderCtrl.isSDA',
      () => {
        self.order.offer = self.isSDA ? 'company' : 'individual';
      },
      true,
    );

    self.isSpecialNumber = false;
    self.typologies = { france: [], belgium: [] };

    self.datePickerOptions = {
      minDate: self.minDate,
      dateDisabled(dateAndMode) {
        const isBankHoliday = TucBankHolidays.checkIsBankHoliday(
          'FR',
          dateAndMode.date,
        );
        return (
          (dateAndMode.mode === 'day' &&
            (dateAndMode.date.getDay() === 0 ||
              dateAndMode.date.getDay() === 6)) ||
          isBankHoliday
        );
      },
    };

    // fetch list of billing accounts
    // load one french 0033 service (needed for autocomplete the entreprise field)
    return $q
      .all({
        groups: tucVoipBillingAccount.fetchAll(),
        services: tucVoipService.fetchAllIds($stateParams.billingAccount),
      })
      .then(({ groups, services }) => {
        self.billingAccounts = sortBy(groups, [
          (group) => group.getDisplayedName(),
        ]);
        self.order.billingAccount = $stateParams.billingAccount;
        self.serviceForFetchEntrepriseInfos =
          services.length > 0
            ? services.find((number) => startsWith(number, '0033'))
            : null;
      })
      .catch((err) => {
        TucToast.error(get(err, 'data.message'));
        return $q.reject(err);
      })
      .then(() =>
        OvhApiOrder.v6()
          .schema()
          .$promise.then((schema) => {
            if (
              schema &&
              schema.models['telephony.NumberSpecialTypologyEnum'] &&
              schema.models['telephony.NumberSpecialTypologyEnum'].enum
            ) {
              const typologies = map(
                schema.models['telephony.NumberSpecialTypologyEnum'].enum,
                (typo) => ({
                  value: typo,
                  label: $translate.instant(
                    `telephony_order_specific_typology_${typo.replace(
                      new RegExp('^be_|fr_'),
                      '',
                    )}_label`,
                  ),
                }),
              );

              self.typologies.france = filter(typologies, (typo) =>
                startsWith(typo.value, 'fr_'),
              );
              self.typologies.belgium = filter(typologies, (typo) =>
                startsWith(typo.value, 'be_'),
              );
              return self.typologies;
            }

            TucToast.error(
              $translate.instant('telephony_order_specific_typology_error'),
            );
            return $q.reject();
          })
          .catch((error) => {
            TucToast.error(
              $translate.instant('telephony_order_specific_typology_error'),
            );
            return $q.reject(error);
          }),
      );
  }

  self.onSDATypeChange = function onSDATypeChange() {
    self.order.socialReason = self.isSDA ? 'corporation' : 'individual';
  };

  self.openDesireDatePicker = function openDesireDatePicker(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    self.desireDatePickerOpened = true;
  };

  self.resetAddressFields = function resetAddressFields() {
    self.order.zip = '';
    self.order.city = '';
    self.order.streetName = '';
    self.order.building = '';
    self.order.door = '';
    self.order.floor = '';
    self.order.stair = '';
    self.order.streetNumber = '';
    self.order.streetNumberExtra = '';
    self.autoCompleteStreetName = [];
    self.order.streetType = '';
  };

  // select number corresponding country automatically
  self.onNumberChange = function onNumberChange() {
    const number = self.normalizeNumber(self.order.callNumber);
    if (startsWith(number, '0033')) {
      self.order.country = 'france';
      self.countryCode = 'fr';
    } else if (startsWith(number, '0032')) {
      self.order.country = 'belgium';
      self.order.rio = null;
      self.countryCode = 'be';
    } else if (startsWith(number, '0041')) {
      self.order.country = 'switzerland';
      self.order.rio = null;
      self.countryCode = 'ch';
    }

    // handle special number
    self.isSpecialNumber = some(
      SPECIAL_NUMBER_PREFIX[self.order.country],
      (prefix) => startsWith(number, prefix),
    );
    self.order.specialNumberCategory = self.isSpecialNumber
      ? head(self.typologies[self.order.country]).value
      : null;
    self.order.type = self.isSpecialNumber ? 'special' : 'landline';

    self.order.translatedCountry = $translate.instant(
      `telephony_alias_portability_order_contact_country_${self.order.country}`,
    );
    self.streetNumberExtraEnum =
      PORTABILITY_STREET_NUMBER_EXTRA_ENUM[self.countryCode.toUpperCase()] ||
      PORTABILITY_STREET_NUMBER_EXTRA_ENUM.OTHER;

    if (self.order.country) {
      self.resetAddressFields();
    }
  };

  self.onChooseRedirectToLine = function onChooseRedirectToLine(result) {
    self.order.lineToRedirectAliasTo = result.serviceName;
    self.order.lineToRedirectAliasToDescription = result.description;
  };

  // add sdaNumberToAdd number to numbersList
  self.addSdaNumber = function addSdaNumber() {
    self.order.numbersList.push(self.order.sdaNumberToAdd);
    self.order.numbersList = uniq(self.order.numbersList);
    self.order.sdaNumberToAdd = null;
  };

  // remove given number from numbersList
  self.removeSdaNumber = function removeSdaNumber(number) {
    self.order.numbersList = pull(self.order.numbersList, number);
  };

  // normalize number : replace +33 by 0033
  self.normalizeNumber = function normalizeNumber(numberParam) {
    let number = numberParam;
    if (number) {
      number = number.replace(/^\+/, '00');
    }
    return number;
  };

  self.getOrderParams = function getOrderParams() {
    let params = pick(self.order, sharedAttributes);

    if (params.offer === 'individual') {
      params = assign(params, pick(self.order, 'rio'));
    } else {
      params = assign(params, pick(self.order, 'siret'));
    }
    params.firstName = params.firstName || '';

    if (
      self.isSDA &&
      self.order.sdatype === 'select' &&
      self.order.numbersList.length
    ) {
      params.listNumbers = map(
        self.order.numbersList,
        self.normalizeNumber,
      ).join(',');
    }

    if (self.isSpecialNumber) {
      params.specialNumberCategory = self.order.specialNumberCategory.replace(
        'fr_',
        '',
      );
    }

    if (params.country === 'france') {
      params.fiabilisation = self.order.sdatype === 'all';
    }

    params.callNumber = self.normalizeNumber(params.callNumber);
    params.contactNumber = self.normalizeNumber(params.contactNumber);
    params.desireDate = moment(params.desireDate).format('Y-MM-DD');

    return params;
  };

  self.onSiretChange = function onSiretChange() {
    if (
      self.order.siret?.match(REGEX.siret) &&
      self.serviceForFetchEntrepriseInfos &&
      self.order.country === 'france'
    ) {
      // we have to poll because api call is not synchronous
      self
        .fetchEntrepriseInformations()
        .then((infos) => {
          self.order.name = infos?.informations.isValid
            ? infos?.informations.name
            : '';
        })
        .catch(() => null);
    }
  };

  self.fetchEntrepriseInformations = function fetchEntrepriseInformations() {
    return TelephonyPortabilitiesService.fetchEntrepriseInformations(
      $stateParams.billingAccount,
      self.serviceForFetchEntrepriseInfos,
      self.order.siret,
    ).then((infos) => {
      if (['todo', 'doing'].includes(infos?.status)) {
        return $timeout(() => self.fetchEntrepriseInformations(), 500);
      }
      return infos;
    });
  };

  self.fetchPriceAndContracts = function fetchPriceAndContracts() {
    return OvhApiOrder.Telephony()
      .v6()
      .getPortability(self.getOrderParams())
      .$promise.then(({ details, contracts, prices }) => {
        self.details = details;
        self.contracts = contracts;
        self.prices = prices;
      })
      .catch((err) => {
        const errorMessage = get(err, 'data.message', '');
        if (
          typeof errorMessage === 'string' &&
          errorMessage.toLowerCase().includes('rio')
        ) {
          $scope.PortabilityOrderCtrl.portabilityOrderForm.rio.$setValidity(
            'rioServerError',
            false,
          );
        }
        TucToast.error(errorMessage);
        return $q.reject(err);
      });
  };

  self.onZipcodeChange = function() {
    // Fetch cities for given post code
    if (self.order.zip?.length >= 3) {
      $q.resolve(
        TelephonyPortabilitiesService.getCityAvailable(
          self.order.zip,
          self.countryCode,
        ),
      ).then((cities) => {
        // automatically select city if there is only one
        if (cities?.length === 1) {
          self.order.city = head(cities).name;
          self.getStreetNameList(head(cities).administrationCode);
        }

        self.autoCompleteCity =
          cities?.length > 1
            ? cities.sort((a, b) => {
                if (a.name < b.name) {
                  return -1;
                }
                if (a.name > b.name) {
                  return 1;
                }
                return 0;
              })
            : [];
      });
    }
  };

  self.onCityNameChange = function(modelValue) {
    self.order.city = modelValue?.name;
    self.getStreetNameList(modelValue?.administrationCode);
    self.order.streetName = '';
  };

  self.onStreetNameChange = function(modelValue) {
    self.order.streetName = modelValue.streetName;
  };

  self.onRioChange = function() {
    $scope.PortabilityOrderCtrl.portabilityOrderForm.rio.$setValidity(
      'rioServerError',
      true,
    );
  };

  self.getStreetNameList = function(inseeCode) {
    // Available only if it is a FR service
    if (self.countryCode === 'fr') {
      // we have to poll because api call is not synchronous :(
      self
        .getStreetNameListFunction(inseeCode)
        .then((streets) => {
          self.autoCompleteStreetName =
            streets?.result?.length > 0 ? streets.result : [];
        })
        .catch(() => null);
    }
  };

  self.getStreetNameListFunction = function(inseeCode) {
    return TelephonyPortabilitiesService.getStreetsAvailable(inseeCode).then(
      (streets) => {
        if (streets.status === 'pending') {
          return self.$timeout(
            () => self.getStreetNameListFunction(inseeCode),
            500,
          );
        }
        return streets;
      },
    );
  };

  self.isSubmitDisabled = function() {
    return (
      self.portabilityOrderForm.$invalid ||
      (self.isSDA &&
        self.order.sdatype === 'select' &&
        self.order.numbersList.length === 0) ||
      (self.details && !self.order.isContractsAccepted) ||
      self.order.isOrdering
    );
  };

  self.submitOrder = function submitOrder() {
    if (!self.details) {
      return self.fetchPriceAndContracts();
    }

    self.order.isOrdering = true;
    return OvhApiOrder.Telephony()
      .v6()
      .orderPortability(
        {
          billingAccount: self.order.billingAccount,
        },
        omit(self.getOrderParams(), 'billingAccount'),
      )
      .$promise.then(({ orderId, url }) => {
        self.order.success = true;
        self.order.url = url;
        return OvhApiMe.Order()
          .v6()
          .get({
            orderId,
          })
          .$promise.then(
            () =>
              OvhApiMe.Order()
                .v6()
                .payRegisteredPaymentMean(
                  {
                    orderId,
                  },
                  {
                    paymentMean: 'ovhAccount',
                  },
                )
                .$promise.then(
                  () => {
                    self.order.autoPay = true;
                  },
                  () => {
                    // if it fails no need to reject because portablity order is a success
                    // and validation can always be done by clicking
                    self.order.autoPay = false;
                  },
                ),
            () => {
              // in this case it means that nic bill and connected are not the same
              // so display a message telling that order must be validated by clicking
              // no need to reject because portablity order is a success
              // and validation can always be done by clicking
              self.order.autoPay = false;
            },
          );
      })
      .catch((err) => {
        TucToast.error(
          `${$translate.instant(
            'telephony_alias_portability_order_error',
          )} ${get(err, 'data.message')}`,
        );
        return $q.reject(err);
      })
      .finally(() => {
        self.order.isOrdering = false;
      });
  };

  init();
}
