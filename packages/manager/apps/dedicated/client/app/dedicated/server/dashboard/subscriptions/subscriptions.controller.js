export default class Subscriptions {
  /* @ngInject */
  constructor(DedicatedServerFeatureAvailability) {
    this.DedicatedServerFeatureAvailability = DedicatedServerFeatureAvailability;
  }

  $onInit() {
    this.server = this.dedicatedServer.server;
    this.serviceInfos = this.dedicatedServer.serviceInfos;
  }
}
