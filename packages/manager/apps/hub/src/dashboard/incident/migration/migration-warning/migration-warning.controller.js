export default class {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  trackClick(tracker) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${tracker}`,
      type: 'action',
    });
  }

  confirm() {
    this.trackClick('contract-information::confirm');
    return this.goToContracts(this.servicesIds);
  }

  cancel() {
    this.trackClick('contract-information::cancel');
    return this.goToIncident();
  }
}
