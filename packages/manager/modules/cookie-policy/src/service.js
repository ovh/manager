const TC_PRIVACY_CENTER = 'TC_PRIVACY_CENTER';
const MANAGER_TRACKING = 'MANAGER_TRACKING';

export default class CookiePolicyService {
  /* @ngInject */
  constructor($cookies, $rootScope, coreConfig) {
    this.$cookies = $cookies;
    this.$rootScope = $rootScope;
    this.coreConfig = coreConfig;
  }

  shouldAskConsent() {
    return !this.coreConfig.isRegion('US') && !this.hasManagerTrackingCookie();
  }

  checkConsent() {
    if (this.coreConfig.isRegion('US')) {
      // auto consent for US.
      this.dispatchConsent();
    } else if (this.hasPrivacyCenterCookie()) {
      // if we have privacy center cookie, we overwrite manager consent
      this.consent(this.hasPrivacyCenterConsent());
    } else if (
      this.hasManagerTrackingCookie() &&
      this.hasManagerTrackingConsent()
    ) {
      // if manager consent, we claim it !
      this.dispatchConsent();
    }
  }

  consent(consent = false) {
    // register manager consent in cookie
    this.writeManagerTrackingConsent(consent);
    if (consent) {
      // claim consent
      this.dispatchConsent();
    } else {
      this.dispatchDecline();
    }
  }

  dispatchConsent() {
    this.$rootScope.$broadcast('cookie-policy:consent');
  }

  dispatchDecline() {
    this.$rootScope.$broadcast('cookie-policy:decline');
  }

  hasPrivacyCenterCookie() {
    return !!this.$cookies.get(TC_PRIVACY_CENTER);
  }

  hasPrivacyCenterConsent() {
    return (this.$cookies.get(TC_PRIVACY_CENTER) || '')
      .split(',')
      .includes('2');
  }

  hasManagerTrackingCookie() {
    return !!this.$cookies.get(MANAGER_TRACKING);
  }

  hasManagerTrackingConsent() {
    return (this.$cookies.get(MANAGER_TRACKING) || false) === '1';
  }

  writeManagerTrackingConsent(consent = false) {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 13);
    this.$cookies.put(MANAGER_TRACKING, consent ? '1' : '0', {
      path: '/',
      expires: expirationDate,
    });
  }
}
