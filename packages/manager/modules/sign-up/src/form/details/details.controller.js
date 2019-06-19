import get from 'lodash/get';
import startsWith from 'lodash/startsWith';

import { PHONE_PREFIX } from './details.constants';

export default class SignUpDetailsCtrl {
  constructor() {
    this.phoneModel = {
      value: null,
      model: (...args) => {
        if (args.length) {
          const newPhoneModel = args[0];
          const phonePrefix = get(PHONE_PREFIX, this.signUpFormCtrl.model.phoneCountry);
          this.phoneModel.value = newPhoneModel;
          this.signUpFormCtrl.model.phone = SignUpDetailsCtrl
            .cleanPhoneNumber(newPhoneModel, phonePrefix);
        }
        return this.phoneModel.value;
      },
      validator: {
        test: () => {
          if (this.signUpFormCtrl.rules && this.signUpFormCtrl.rules.phone.regularExpression) {
            return new RegExp(this.signUpFormCtrl.rules.phone.regularExpression)
              .test(this.signUpFormCtrl.model.phone);
          }
          return true;
        },
      },
    };
  }

  /* ==============================
  =            Helpers            =
  =============================== */

  static cleanPhoneNumber(phoneNumberParam, phonePrefix) {
    let phoneNumber = phoneNumberParam;
    if (phoneNumberParam) {
      phoneNumber = phoneNumber.replace(/\s/g, '');
      phoneNumber = phoneNumber.replace(/(?:-)(\d)/g, '$1'); // remove "-" char preceding a digit
      phoneNumber = phoneNumber.replace(/(?:\.)(\d)/g, '$1'); // remove "." char preceding a digit
      phoneNumber = phoneNumber.replace(/(?:\()(\d+)(?:\))/g, '$1'); // remove parenthesis around digits

      if (phonePrefix) {
        const alternativePhonePrefix = `00${phonePrefix.replace('+', '')}`;
        if (startsWith(phoneNumberParam, alternativePhonePrefix)) {
          // check if input value begin with 00${prefix}
          phoneNumber = `+${phonePrefix}${phoneNumberParam.slice(alternativePhonePrefix.length)}`;
        } else if (startsWith(phoneNumberParam, '0')) {
          // or by only a trailing 0
          phoneNumber = `+${phonePrefix}${phoneNumberParam.slice(1)}`;
        }
      }
    }
    return phoneNumber;
  }

  /* -----  End of Helpers  ------ */


  /* =============================
  =            Events            =
  ============================== */

  onPhoneCountryChange() {
    return this.signUpFormCtrl
      .getRules()
      .then(() => {
        // When phone country change, the pattern change too.
        // But... the validation is not done automatically.
        // So... be sure that the phone validation is done.
        const phoneModel = this.formCtrl.phone;
        const modelValue = phoneModel.$modelValue;
        const viewValue = phoneModel.$viewValue;
        const phoneModelValid = phoneModel.$validators.pattern(modelValue, viewValue);
        phoneModel.$setValidity('pattern', phoneModelValid);
      });
  }

  /* -----  End of Events  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    // clean phone number
    const phonePrefix = get(PHONE_PREFIX, this.signUpFormCtrl.model.phoneCountry);
    // this.phoneModel.value = this.signUpFormCtrl.model.phone;
    this.phoneModel.value = this.signUpFormCtrl.model.phone;
    this.phoneModel.model(SignUpDetailsCtrl.cleanPhoneNumber(
      this.signUpFormCtrl.model.phone,
      phonePrefix,
    ));

    // set specific model callbacks
    this.signUpFormCtrl.model.$phoneCountry.setCallback(this.onPhoneCountryChange.bind(this));
  }

  /* -----  End of Hooks  ------ */
}
