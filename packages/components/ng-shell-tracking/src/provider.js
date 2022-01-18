export default class NgAtInternet {
  constructor(trackingPlugin) {
    this.trackingPlugin = trackingPlugin;
  }

  $get() {
    console.log(this.trackingPlugin);
    return this.trackingPlugin;
  }

  setTracking(trackingPlugin) {
    this.trackingPlugin = trackingPlugin;
  }
}
