import filter from 'lodash/filter';

export default class {
  /* @ngInject */
  constructor($location, $state) {
    this.$location = $location;
    this.$state = $state;
  }

  activateOla() {
    this.$state.go('app.dedicated-server.server.interfaces.ola-activation');
  }

  goToConfiguration() {
    this.$state.go('app.dedicated-server.server.interfaces.ola-configuration');
  }

  activateOrConfigure() {
    if (this.ola.isActivated()) {
      this.goToConfiguration();
    } else {
      this.activateOla();
    }
  }

  getPrice(price) {
    const languageLocale = this.user.language.replace('_', '-');
    return Intl.NumberFormat(languageLocale, {
      style: 'currency',
      currency: this.price.currencyCode,
      maximumSignificantDigits: 1,
    }).format(price);
  }

  hasBandwidthExtension() {
    const specs = filter(this.ola.availableModes, {
      interfaces: [{ count: 4, aggregation: true }],
    });
    return specs.length > 0;
  }
}
