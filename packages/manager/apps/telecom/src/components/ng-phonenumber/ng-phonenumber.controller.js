import examples from 'libphonenumber-js/mobile/examples';
import {
  AsYouType,
  parsePhoneNumberWithError,
  getCountries,
  isValidPhoneNumber,
  getExampleNumber,
  getCountryCallingCode,
} from 'libphonenumber-js';

export default class NgPhonenumberController {
  /* @ngInject */
  constructor($scope, $translate, coreConfig) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.coreConfig = coreConfig;

    this.phoneValid = true;
  }

  $onInit() {
    const user = this.coreConfig.getUser();

    // Generate the list of countries with their labels and prefixes
    this.countryList = (this.countries || getCountries())
      .map((country) => ({
        label: `${this.$translate.instant(
          `country_${country}`,
        )} (+${getCountryCallingCode(country)})`,
        value: country,
        phoneCode: `+${getCountryCallingCode(country)}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    // Determine the default selected country
    const defaultCountryCode = this.defaultCountry || user.ovhSubsidiary;
    this.selectedCountry =
      this.countryList.find(
        (country) => country.value === defaultCountryCode,
      ) || null;
    this.phonePlaceholder = getExampleNumber(
      defaultCountryCode,
      examples,
    )?.formatNational();

    // Handle the initial phone number if provided
    if (this.model) {
      this.initializePhoneNumber(this.model);
    }

    // Watch for model changes
    this.$scope.$watch(
      () => this.model,
      (newValue, oldValue) => {
        if (newValue === oldValue || (!newValue && this.phonenumber)) return;

        const wasReset = oldValue && !newValue;

        if (newValue) {
          this.initializePhoneNumber(newValue);
        } else if (wasReset) {
          this.phonenumber = '';
          this.phonePlaceholder = '';
        }
      },
    );
  }

  initializePhoneNumber(phoneNumber) {
    try {
      const cleanPhoneNumber = phoneNumber.startsWith('00')
        ? `+${phoneNumber.slice(2)}`
        : phoneNumber;
      const parsedNumber = parsePhoneNumberWithError(cleanPhoneNumber);

      if (parsedNumber && parsedNumber.isValid()) {
        this.selectedCountry = this.countryList.find(
          (country) => country.value === parsedNumber.country,
        );
        this.phonenumber = parsedNumber.formatNational();
        this.model = parsedNumber.format('E.164');
      } else {
        this.resetPhoneNumber();
      }
    } catch (error) {
      this.resetPhoneNumber();
    }
  }

  resetPhoneNumber() {
    this.phonenumber = '';
    this.phonePlaceholder = '';
    this.model = '';
  }

  onPhoneNumberChange() {
    if (this.phonenumber) {
      const asYouType = new AsYouType(
        this.selectedCountry ? this.selectedCountry.value : undefined,
      );
      this.phonenumber = asYouType.input(this.phonenumber);

      const isValid = isValidPhoneNumber(
        this.phonenumber,
        this.selectedCountry ? this.selectedCountry.value : undefined,
      );
      if (isValid && this.selectedCountry) {
        const parsedNumber = parsePhoneNumberWithError(
          this.phonenumber,
          this.selectedCountry.value,
        );
        this.model = parsedNumber.format('E.164');
      } else {
        this.model = '';
      }
      if (this.onNumberChange) {
        this.onNumberChange({ phoneNumber: this.phonenumber });
      }
    } else {
      this.model = '';
      if (this.onNumberChange) {
        this.onNumberChange({ phoneNumber: '' });
      }
    }
  }

  onPhoneCountryChange() {
    if (this.selectedCountry) {
      this.phonePlaceholder = getExampleNumber(
        this.selectedCountry.value,
        examples,
      )?.formatNational();
      if (this.onCountryChange) {
        this.onCountryChange({
          country: this.selectedCountry.value,
          phoneCode: this.selectedCountry.phoneCode,
        });
      }
    }
  }

  validatePhoneNumber(value) {
    if (this.selectedCountry && value) {
      const isValid = isValidPhoneNumber(value, this.selectedCountry.value);

      if (this.onValidityChange) {
        this.onValidityChange({ isValid });
      }

      this.phoneValid = isValid;
      return isValid;
    }

    return true;
  }
}
