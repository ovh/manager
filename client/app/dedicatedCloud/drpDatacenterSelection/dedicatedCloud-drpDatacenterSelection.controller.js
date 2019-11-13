export default class {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  cancelSelection() {
    return this.$state.go('^');
  }

  goToDrpConfiguration(datacenterId) {
    this.isRedirecting = true;
    return this.$state
      .go(
        'app.dedicatedClouds.datacenter.drp',
        { datacenterId, drpInformations: this.currentDrp },
      );
  }
}
