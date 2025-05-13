export default class LogsDataStreamsCtrl {
  $onInit() {
    this.logSubscriptionApiData = {
      url: this.url,
      params: {
        kind: this.kind,
      },
    };
  }
}
