export default /* @ngInject */ () => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupLinePhoneConfiguration(
    phoneConfigurationOptionsParam,
  ) {
    let phoneConfigurationOptions = phoneConfigurationOptionsParam;

    if (!phoneConfigurationOptions) {
      phoneConfigurationOptions = {};
    }

    this.type = phoneConfigurationOptions.type;
    this.name = phoneConfigurationOptions.name;
    this.group = phoneConfigurationOptions.group;
    this.description = phoneConfigurationOptions.description;
    this.maxlength = phoneConfigurationOptions.maxlength;
    this.rangeValue = phoneConfigurationOptions.rangeValue;
    this.level = phoneConfigurationOptions.level;
    this.enum = phoneConfigurationOptions.enum;

    this.prevValue = null;

    this.setValues(
      phoneConfigurationOptions.value,
      phoneConfigurationOptions.default,
    );
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  TelephonyGroupLinePhoneConfiguration.prototype.setValues = function setValues(
    currentValue,
    defaultValue,
  ) {
    const self = this;

    switch (self.type) {
      case 'numeric':
        self.value = parseInt(currentValue, 10);
        self.default = parseInt(defaultValue, 10);
        break;
      case 'boolean':
        self.value = currentValue === 'true';
        self.default = defaultValue === 'true';
        break;
      default:
        self.value = currentValue;
        self.default = defaultValue;
    }

    self.resetPrevValue();
  };

  TelephonyGroupLinePhoneConfiguration.prototype.resetPrevValue = function resetPrevValue() {
    const self = this;

    self.prevValue = self.value;
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupLinePhoneConfiguration;
};
