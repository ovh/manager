export default class DashboardController {
  $onInit() {
    return this.trackingPrefix.then((prefix) => {
      this.prefix = prefix;
    });
  }
}
