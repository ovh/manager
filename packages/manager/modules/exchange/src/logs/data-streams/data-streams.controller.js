export default class ExchangeLogsDataStreamsCtrl {
  $onInit() {
    this.logSubscriptionApiData = {
      url: this.url,
      params: {
        kind: this.kind,
      },
    };
  }
}
