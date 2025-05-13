export default class NgAtInternet {
  constructor(trackingPlugin) {
    this.trackingPlugin = trackingPlugin;
  }

  $get() {
    return this;
  }

  setTracking(trackingPlugin) {
    this.trackingPlugin = trackingPlugin;
  }

  async init(withConsent) {
    return this.trackingPlugin.init(withConsent);
  }

  async onConsentModalDisplay() {
    return this.trackingPlugin.onConsentModalDisplay();
  }

  async onUserConsentFromModal(consent) {
    return this.trackingPlugin.onUserConsentFromModal(consent);
  }

  async trackClick(data) {
    return this.trackingPlugin.trackClick(data);
  }

  async trackPage(data) {
    return this.trackingPlugin.trackPage(data);
  }

  async trackEvent(data) {
    return this.trackingPlugin.trackEvent(data);
  }

  async trackImpression(data) {
    return this.trackingPlugin.trackImpression(data);
  }

  async trackClickImpression(data) {
    return this.trackingPlugin.trackClickImpression(data);
  }

  async isEnabled() {
    return this.trackingPlugin.isEnabled();
  }

  async setEnabled(state) {
    return this.trackingPlugin.setEnabled(state);
  }

  async setRegion(region) {
    return this.trackingPlugin.setRegion(region);
  }

  async setPciProjectMode(params) {
    return this.trackingPlugin.setPciProjectMode(params);
  }

  async setDefaults(def) {
    return this.trackingPlugin.setDefaults(def);
  }
}
