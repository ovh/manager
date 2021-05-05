export default class CoreConfig {
  setEnvironment(environment) {
    this.environment = environment;
  }

  getRegion() {
    return this.environment.getRegion();
  }

  isRegion(region) {
    const regions = Array.isArray(region) ? region : [region];
    return regions.includes(this.environment.getRegion());
  }

  getUser() {
    return this.environment.getUser();
  }

  getUserLocale() {
    return this.environment.getUserLocale();
  }

  setUserLocale(locale) {
    return this.environment.setUserLocale(locale);
  }

  getUserLanguage() {
    return this.environment.getUserLanguage();
  }

  getVersion() {
    return this.environment.getVersion();
  }

  getApplicationName() {
    return this.environment.getApplicationName();
  }

  getUniverse() {
    return this.environment.getUniverse();
  }

  setUniverse(universe) {
    return this.environment.setUniverse(universe);
  }

  getApplicationURLs() {
    return this.environment.getApplicationURLs();
  }

  getApplicationURL(id) {
    return this.environment.getApplicationURL(id);
  }

  getApplicationBaseURL(id) {
    const applicationURL = this.environment.getApplicationURL(id);
    if (applicationURL === this.getCurrentApplicationURL()) {
      return `${window.location.origin}${window.location.pathname}`;
    }
    return applicationURL;
  }

  getCurrentApplicationURL() {
    return this.environment.getApplicationURL(
      this.environment.getApplicationName(),
    );
  }

  setMessage(message) {
    return this.environment.setMessage(message);
  }

  getMessage() {
    return this.environment.getMessage();
  }

  $get() {
    return {
      getRegion: () => this.getRegion(),
      isRegion: (region) => this.isRegion(region),

      getUser: () => this.getUser(),

      getUserLocale: () => this.getUserLocale(),
      setUserLocale: (locale) => this.setUserLocale(locale),
      getUserLanguage: () => this.getUserLanguage(),

      getVersion: () => this.getVersion(),

      getApplicationName: () => this.getApplicationName(),

      getUniverse: () => this.getUniverse(),
      setUniverse: (universe) => this.setUniverse(universe),

      getApplicationURLs: () => this.getApplicationURLs(),
      getApplicationURL: (id) => this.getApplicationURL(id),
      getApplicationBaseURL: (id) => this.getApplicationBaseURL(id),
      getCurrentApplicationURL: () => this.getCurrentApplicationURL(),

      setMessage: (message) => this.setMessage(message),
      getMessage: () => this.getMessage(),
    };
  }
}
