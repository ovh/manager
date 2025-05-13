import { snakeCase, startsWith } from 'lodash-es';

import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/js/utils';
import moment from 'moment';

export default /* @ngInject */ function(
  $timeout,
  $anchorScroll,
  $http,
  ovhContact,
  OvhContact,
  CONTACT_EDITION,
) {
  const self = this;

  let alwaysVisibleFieldsByCountry = false;

  self.loading = {
    init: false,
  };

  self.datepicker = {
    open: false,
    format: 'shortDate',
    options: {
      showWeeks: false,
      maxDate: moment(),
    },
  };

  self.creationRules = null;
  self.sortedFieldsByCountry = null;
  self.saveError = null;

  self.cancelEdition = function cancelEdition() {
    if (!self.ovhContactCtrl.contact.id) {
      self.ovhContactCtrl.stopContactCreation();
    } else {
      self.ovhContactCtrl.contact.stopEdition(true);
    }
    $anchorScroll();
  };

  self.saveContact = function saveContact() {
    self.ovhContactCtrl.loading.load = true;

    const savePromise = self.ovhContactCtrl.contact.id
      ? self.ovhContactCtrl.contact.save()
      : self.ovhContactCtrl.contact
          .create(
            $http,
            OvhContact,
            this.customList,
            self.ovhContactCtrl.contact,
          )
          .then(() =>
            !self.options.customFieldForm
              ? ovhContact.addContact(self.ovhContactCtrl.contact)
              : null,
          );

    return savePromise
      .then(
        () => {
          self.ovhContactCtrl.contact.stopEdition();
        },
        (error) => {
          self.saveError = error;
          $anchorScroll();
        },
      )
      .finally(() => {
        self.ovhContactCtrl.loading.load = false;
      });
  };

  function clear() {
    self.saveError = null;

    self.sortedFieldsByCountry =
      self.options.customSortFieldForm ||
      CONTACT_EDITION[`SORTED_FIELDS_${self.ovhContactCtrl.contact.country}`] ||
      CONTACT_EDITION.SORTED_FIELDS_DEFAULT;

    alwaysVisibleFieldsByCountry =
      self.options.customFieldForm ||
      CONTACT_EDITION[
        `ALWAYS_VISIBLE_FIELDS_${self.ovhContactCtrl.contact.country}`
      ] ||
      CONTACT_EDITION.ALWAYS_VISIBLE_FIELDS_DEFAULT;
  }

  function formatPhoneNumbers(phoneNumber) {
    return phoneNumber ? phoneNumber.replace('.', '') : phoneNumber;
  }

  self.isVisibleField = function isVisibleField(field) {
    let isVisible = !!(
      self.creationRules &&
      self.creationRules[field] &&
      self.creationRules[field].canBeNull === 0
    );

    if (!isVisible && alwaysVisibleFieldsByCountry.includes(field)) {
      isVisible = true;
    }

    if (!isVisible) {
      self.ovhContactCtrl.contact[field] = null;
    }

    return isVisible;
  };

  self.getFieldType = function getFieldType(field) {
    if (/mail/i.test(field)) {
      return 'email';
    }
    if (/phone|fax/i.test(field)) {
      return 'tel';
    }
    if (field === 'birthDay') {
      return 'date';
    }
    return 'text';
  };

  self.getFieldTranslationKey = function getFieldTranslationKey(field) {
    return `ovh_contact_edit_label_${snakeCase(field)}`;
  };

  self.formatedPhone = function formatedPhone(phoneValue) {
    if (arguments.length > 0) {
      self.ovhContactCtrl.contact.phone = phoneValue;
      return self.ovhContactCtrl.contact.phone;
    }
    return formatPhoneNumbers(self.ovhContactCtrl.contact.phone);
  };

  self.formatedCellPhone = function formatedCellPhone(phoneValue) {
    if (arguments.length > 0) {
      self.ovhContactCtrl.contact.cellPhone = phoneValue;
      return self.ovhContactCtrl.contact.cellPhone;
    }
    return formatPhoneNumbers(self.ovhContactCtrl.contact.cellPhone);
  };

  self.initializeTelInput = function initializeTelInput(
    inputId,
    initialValue = '',
    options = {},
  ) {
    const inputToInitialize = document.getElementById(inputId);
    if (inputToInitialize) {
      const telInput = intlTelInput(inputToInitialize, {
        initialCountry: self.ovhContactCtrl.contact.address.country,
        nationalMode: false,
        preferredCountries: [''],
        utilsScript: 'build/js/utils.js',
        ...options,
      });

      inputToInitialize.addEventListener(
        'blur',
        (() =>
          function forcePhoneFormat() {
            // use timeout to force phone number to be undefined if only country dial code or to be
            // prefixed by "+"(international format) if phone number value starts with country dialcode
            $timeout(() => {
              const countryData = telInput.getSelectedCountryData();
              if (
                self.ovhContactCtrl.contact[inputToInitialize.id] ===
                  countryData.dialCode ||
                self.ovhContactCtrl.contact[inputToInitialize.id] ===
                  `+${countryData.dialCode}` ||
                self.ovhContactCtrl.contact[inputToInitialize.id] === `+`
              ) {
                self.ovhContactCtrl.contact[inputToInitialize.id] = undefined;
              } else if (
                startsWith(
                  self.ovhContactCtrl.contact[inputToInitialize.id],
                  countryData.dialCode,
                )
              ) {
                self.ovhContactCtrl.contact[inputToInitialize.id] = `+${
                  self.ovhContactCtrl.contact[inputToInitialize.id]
                }`;
              }
            }, 100);
          })(),
      );

      inputToInitialize.addEventListener(
        'keyup',
        (() =>
          function forcePlusChar() {
            $timeout(() => {
              if (
                !startsWith(
                  self.ovhContactCtrl.contact[inputToInitialize.id],
                  '+',
                )
              ) {
                self.ovhContactCtrl.contact[inputToInitialize.id] = `+${self
                  .ovhContactCtrl.contact[inputToInitialize.id] || ''}`;
              }
            }, 100);
          })(),
      );

      inputToInitialize.addEventListener(
        'focus',
        (() =>
          function setCountryOnFocus() {
            $timeout(() => {
              const countryData = telInput.getSelectedCountryData();
              if (!self.ovhContactCtrl.contact[inputToInitialize.id]) {
                self.ovhContactCtrl.contact[
                  inputToInitialize.id
                ] = `+${countryData.dialCode}`;
              }
            }, 100);
          })(),
      );

      const getSetValidityFunction = () =>
        function setValidity() {
          $timeout(() => {
            self.ovhContactEdit[inputToInitialize.id].$setValidity(
              'internationalPhoneNumber',
              telInput.isValidNumber(),
            );
          }, 100); // Setting validity on blur, right after the forcePhoneFormat has been done
        };

      inputToInitialize.addEventListener('blur', getSetValidityFunction());
      inputToInitialize.addEventListener('keydown', getSetValidityFunction());
      inputToInitialize.addEventListener(
        'keypress',
        function blockNonNumericKeys(event) {
          if (event.charCode < 48 || event.charCode > 57) {
            event.preventDefault();
            event.stopPropagation();
          }
        },
      );

      telInput.setNumber(initialValue);
      return telInput;
    }
    return null;
  };

  self.$onInit = function $onInit() {
    self.loading.init = true;
    self.ovhContactCtrl.loading.load = true;

    clear();

    return ovhContact
      .getCreationRules()
      .then((rules) => {
        self.creationRules = self.options.customFieldRules || rules;
        self.ovhContactCtrl.manageOnInit();
      })
      .finally(() => {
        self.loading.init = false;
        self.ovhContactCtrl.loading.load = false;

        self.itiPhone = self.initializeTelInput('phone', self.formatedPhone(), {
          placeholderNumberType: 'FIXED_LINE',
        });
        self.itiCellPhone = self.initializeTelInput(
          'cellPhone',
          self.formatedCellPhone(),
        );
      });
  };

  self.$onDestroy = function $onDestroy() {
    if (self.itiPhone) {
      self.itiPhone.destroy();
    }
    if (self.itiCellPhone) {
      self.itiCellPhone.destroy();
    }
  };
}
