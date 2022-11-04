export default class ParamsTrackingPage {
  $onInit() {
    if (this.tagPageParams) {
      this.trackPage(this.tagPageParams);
    }
  }
}
