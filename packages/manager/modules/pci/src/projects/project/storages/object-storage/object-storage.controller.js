export default class ParamsTrackingPage {
  /* @ngInject */ constructor(CHANGELOG) {
    this.CHANGELOG = CHANGELOG;
  }

  $onInit() {
    if (this.tagPageParams) {
      this.trackPage(this.tagPageParams);
    }
  }
}
