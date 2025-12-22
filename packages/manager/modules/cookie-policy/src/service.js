const TC_PRIVACY_CENTER = 'TC_PRIVACY_CENTER';
const WEBSITE_TRACKING_CONSENT_VALUE = '2';

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

  consent(consent = false, fromModal = false) {
    // register manager consent in cookie
    this.writeManagerTrackingConsent(consent);
    if (consent) {
      // claim consent
      this.dispatchConsent(fromModal);
    } else {
      this.dispatchDecline(fromModal);
    }
  }

  dispatchConsent(fromModal = false) {
    this.$rootScope.$broadcast('cookie-policy:consent', {
      fromModal,
    });
  }

  dispatchDecline(fromModal = false) {
    this.$rootScope.$broadcast('cookie-policy:decline', {
      fromModal,
    });
  }

  hasPrivacyCenterCookie() {
    return !!this.$cookies.get(TC_PRIVACY_CENTER);
  }

  hasPrivacyCenterConsent() {
    return (this.$cookies.get(TC_PRIVACY_CENTER) || '')
      .split(',')
      .includes(WEBSITE_TRACKING_CONSENT_VALUE);
  }

  hasManagerTrackingCookie() {
    return this.hasPrivacyCenterCookie();
  }

  hasManagerTrackingConsent() {
    return this.hasPrivacyCenterConsent();
  }

  writeManagerTrackingConsent(consent = false) {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 13);
    this.$cookies.put(
      TC_PRIVACY_CENTER,
      consent ? WEBSITE_TRACKING_CONSENT_VALUE : '0',
      {
        path: '/',
        expires: expirationDate,
      },
    );
  }
}
