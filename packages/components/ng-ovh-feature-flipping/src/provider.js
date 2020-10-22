import FeatureFlipping from './service';

export default class NgOvhFeatureFlippingProvider {
  constructor() {
    this.applicationName = null;
  }

  /**
   * Set the application name that will request the 2API feature availability.
   *
   * @param {string} applicationName The current application name
   */
  setApplicationName(applicationName) {
    this.applicationName = applicationName;
  }

  /* @ngInject */
  $get($q, $http) {
    return new FeatureFlipping($q, $http, this.applicationName);
  }
}
