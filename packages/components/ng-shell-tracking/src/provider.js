export default class NgAtInternet {
  constructor(trackingPlugin) {
    this.trackingPlugin = trackingPlugin;
  }

  $get() {
    this.trackingPlugin.init();
    return this.trackingPlugin;
  }

  setTracking(trackingPlugin) {
    this.trackingPlugin = trackingPlugin;
  }
}
