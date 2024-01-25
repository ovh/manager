export default class NgOvhContractsSummaryController {
  /* @ngInject */
  contructor(atInternet) {
    this.atInternet = atInternet;
  }

  trackContractClick() {
    if (this.trackingPrefix) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::contract::download-contract`,
        type: 'action',
      });
    }
    return null;
  }
}
