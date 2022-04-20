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

  async init() {
    return this.trackingPlugin.init();
  }

  async isTagAvailable() {
    return this.trackingPlugin.isTagAvailable();
  }

  async clearTrackQueue() {
    return this.trackingPlugin.clearTrackQueue();
  }

  async processTrackQueue() {
    return this.trackingPlugin.processTrackQueue();
  }

  async initTag() {
    return this.trackingPlugin.initTag();
  }

  async getTag() {
    return this.trackingPlugin.getTag();
  }

  async trackClick(data) {
    return this.trackingPlugin.trackClick(data);
  }

  async trackPage(data) {
    return this.trackingPlugin.trackPage(data);
  }

  async trackEvent(data) {
    return this.trackingPlugin.trackOrder(data);
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

  async setDebug(state) {
    return this.trackingPlugin.setDebug(state);
  }

  async isDebugActive() {
    return this.trackingPlugin.isDebugActive();
  }

  async getRegion() {
    return this.trackingPlugin.getRegion();
  }

  async setRegion(region) {
    return this.trackingPlugin.setRegion(region);
  }

  async setDefaultsPromise(promise) {
    return this.trackingPlugin.setDefaultsPromise(promise);
  }

  async getDefaultsPromise() {
    return this.trackingPlugin.getDefaultsPromise();
  }

  async getDefaults() {
    return this.trackingPlugin.getDefaults();
  }

  async setDefaults(def) {
    return this.trackingPlugin.setDefaults(def);
  }

  async isDefaultSet() {
    return this.trackingPlugin.isDefaultSet();
  }
}
