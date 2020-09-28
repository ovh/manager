import isNumber from 'lodash/isNumber';

export default class {
  /* @ngInject */
  constructor($location, $state) {
    this.$location = $location;
    this.$state = $state;
  }

  $onInit() {
    if (!isNumber(this.ola.configStep)) {
      this.ola.configStep = 0;
    }
  }

  getStepClassname(step) {
    return {
      'oui-progress-tracker__step_active': this.ola.configStep === step,
      'oui-progress-tracker__step_complete': this.ola.configStep > step,
    };
  }

  activateOla() {
    this.$state.go('app.dedicated-server.server.interfaces.ola-activation');
  }

  closeSteps() {
    // Clear query parameters then reload current state
    this.$location.url(this.$location.path());
    this.$state.reload();
  }

  goToNextStep() {
    this.ola.configStep += 1;

    // This parameter is dynamic. It must not reload the page
    this.$location.search('configStep', this.ola.configStep);
  }

  goToConfiguration() {
    this.$state.go('app.dedicated-server.server.interfaces.ola-configuration');
  }

  getPrice(price) {
    const languageLocale = this.user.language.replace('_', '-');
    return Intl.NumberFormat(languageLocale, {
      style: 'currency',
      currency: this.price.currencyCode,
      maximumSignificantDigits: 1,
    }).format(price);
  }
}
