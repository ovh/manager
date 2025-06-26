import get from 'lodash/get';
import startsWith from 'lodash/startsWith';

import { ALLOWED_COUNTRY_EXTRA_INFO, PHONE_PREFIX } from './details.constants';

export default class SignUpDetailsCtrl {
  /* @ngInject */
  constructor($timeout) {
    // dependencies injections
    this.$timeout = $timeout;
    this.ALLOWED_COUNTRY_EXTRA_INFO = ALLOWED_COUNTRY_EXTRA_INFO;
  }

  /* ==============================
  =            Helpers            =
  =============================== */

  static cleanPhoneNumber(phoneNumberParam, phonePrefix) {
    let phoneNumber = phoneNumberParam;
    if (phoneNumber) {
      phoneNumber = phoneNumber.replace(/\s/g, '');
      phoneNumber = phoneNumber.replace(/(?:-)(\d)/g, '$1'); // remove "-" char preceding a digit
      phoneNumber = phoneNumber.replace(/(?:\.)(\d)/g, '$1'); // remove "." char preceding a digit
      phoneNumber = phoneNumber.replace(/(?:\()(\d+)(?:\))/g, '$1'); // remove parenthesis around digits

      if (phonePrefix) {
        const alternativePhonePrefix = `00${phonePrefix.replace('+', '')}`;
        if (startsWith(phoneNumber, alternativePhonePrefix)) {
          // check if input value begin with 00${prefix}
          phoneNumber = `+${phonePrefix}${phoneNumber.slice(
            alternativePhonePrefix.length,
          )}`;
        } else if (!startsWith(phoneNumber, `+${phonePrefix}`)) {
          // or not by the phonePrefix
          phoneNumber = `+${phonePrefix}${phoneNumber}`;
        }
      }
    }
    return phoneNumber;
  }

  static cleanZipCode(zipCodeParam, zipPrefix) {
    let zipCode = zipCodeParam;

    if (zipPrefix) {
      if (!startsWith(zipCode, zipPrefix)) {
        // if zip code starts with prefix, remove it
        zipCode = `${zipPrefix}${zipCode}`;
      }
    }

    return zipCode;
  }

  static setInputValidity(inputFormName, form) {
    const inputField = form[inputFormName];

    if (!inputField) {
      throw new Error(
        `Sign up form account: Input ${inputFormName} not found in the form`,
      );
    }

    const inputModelValue = inputField.$modelValue;
    const inputViewValue = inputField.$viewValue;

    const inputModelValid = inputField.$validators.pattern(
      inputModelValue,
      inputViewValue,
    );

    inputField.$setValidity('pattern', inputModelValid);
  }

  refocusOnField(fieldName) {
    this.constructor.setInputValidity(fieldName, this.formCtrl);
    SignUpDetailsCtrl.setElementFocus(fieldName);
  }

  preselectLanguage(isOnChange) {
    if (get(this.signUpFormCtrl, 'rules.language.in.length', 0) === 1) {
      const [uniqueLanguage] = this.signUpFormCtrl.rules.language.in;
      this.signUpFormCtrl.model.language = uniqueLanguage.value;
    } else if (isOnChange) {
      this.signUpFormCtrl.model.language = null;
    }
  }

  callFormCtrlGetRules() {
    return this.signUpFormCtrl.getRules();
  }

  /* -----  End of Helpers  ------ */

  /* =============================
  =            Events            =
  ============================== */

  onPhoneCountrySelect() {
    this.$timeout(() => {
      // set the focus to phone field to fix error display
      SignUpDetailsCtrl.setElementFocus('phone');
    });
  }

  /* -----  End of Events  ------ */

  /* ================================
  =            Callbacks            =
  ================================= */

  onCountryChange() {
    return this.callFormCtrlGetRules().then(() => {
      if (this.canChangePhoneCountry()) {
        this.signUpFormCtrl.model.phoneCountry = this.signUpFormCtrl.model.country;
      }

      this.preselectLanguage(true);
      this.refocusOnField('zip');
    });
  }

  onAreaChange() {
    return this.callFormCtrlGetRules().then(() => {
      this.refocusOnField('zip');
    });
  }

  canChangePhoneCountry() {
    return !this.phoneModel.value && this.signUpFormCtrl.model.country;
  }

  onPhoneCountryChange() {
    return this.callFormCtrlGetRules().then(() => {
      // When phone country change, the pattern change too.
      // But... the validation is not done automatically.
      // So... be sure that the phone validation is done.
      this.constructor.setInputValidity('phone', this.formCtrl);
    });
  }

  /* -----  End of Callbacks  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    // other attributes used in view
    this.phoneModel = {
      value: null,
      model: (...args) => {
        if (args.length) {
          const newPhoneModel = args[0];
          const phonePrefix = get(
            PHONE_PREFIX,
            this.signUpFormCtrl.model.phoneCountry,
          );
          this.phoneModel.value = newPhoneModel;
          this.signUpFormCtrl.model.phone = SignUpDetailsCtrl.cleanPhoneNumber(
            newPhoneModel,
            phonePrefix,
          );
        }
        return this.phoneModel.value;
      },
      validator: {
        test: () => {
          if (
            this.signUpFormCtrl.rules &&
            this.signUpFormCtrl.rules.phone.regularExpression
          ) {
            return new RegExp(
              this.signUpFormCtrl.rules.phone.regularExpression,
            ).test(this.signUpFormCtrl.model.phone);
          }
          return true;
        },
      },
    };

    this.zipModel = {
      value: null,
      model: (...args) => {
        if (args.length) {
          const newZipModel = args[0];
          this.zipModel.value =
            newZipModel?.replace(
              get(this.signUpFormCtrl.rules, 'zip.prefix'),
              '',
            ) || '';
          this.signUpFormCtrl.model.zip = SignUpDetailsCtrl.cleanZipCode(
            newZipModel,
            get(this.signUpFormCtrl.rules, 'zip.prefix'),
          );
        }
        return this.zipModel.value;
      },
      validator: {
        test: () => {
          if (
            this.signUpFormCtrl.rules &&
            this.signUpFormCtrl.rules.zip.regularExpression
          ) {
            return new RegExp(
              this.signUpFormCtrl.rules.zip.regularExpression,
            ).test(this.signUpFormCtrl.model.zip);
          }
          return true;
        },
      },
    };

    // clean phone number
    const phonePrefix = get(
      PHONE_PREFIX,
      this.signUpFormCtrl.model.phoneCountry,
    );
    this.phoneModel.value = this.signUpFormCtrl.model.phone;
    this.phoneModel.model(
      SignUpDetailsCtrl.cleanPhoneNumber(
        this.signUpFormCtrl.model.phone,
        phonePrefix,
      ),
    );

    if (this.canChangePhoneCountry()) {
      this.signUpFormCtrl.model.phoneCountry = this.signUpFormCtrl.model.country;
    }

    // clean zip code
    this.zipModel.value = this.signUpFormCtrl.model.zip;
    this.zipModel.model(
      SignUpDetailsCtrl.cleanZipCode(
        this.signUpFormCtrl.model.zip,
        get(this.signUpFormCtrl.rules, 'zip.prefix'),
      ),
    );

    // set specific model callbacks
    if (this.signUpFormCtrl.model.$country) {
      this.signUpFormCtrl.model.$country.setCallback(
        this.onCountryChange.bind(this),
      );
    }
    if (this.signUpFormCtrl.model.$phoneCountry) {
      this.signUpFormCtrl.model.$phoneCountry.setCallback(
        this.onPhoneCountryChange.bind(this),
      );
    }

    this.preselectLanguage(false);
  }

  static setElementFocus(elementName) {
    document.getElementsByName(elementName)[0].focus();
  }
  /* -----  End of Hooks  ------ */

  onPhoneTypeChange() {
    if (
      this.signUpFormCtrl.model.phoneType === 'landline' &&
      this.signUpFormCtrl.smsConsent
    ) {
      this.signUpFormCtrl.smsConsent = false;
      this.onSmsConsentChange(this.signUpFormCtrl.smsConsent);
    }
    this.trackField(
      'phone-type',
      `select-${this.signUpFormCtrl.model.phoneType}`,
    );
  }

  onSmsConsentChange(consent) {
    this.trackField('sms-consent', consent ? 'enable' : 'disable');
  }
}
