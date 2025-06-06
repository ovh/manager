export default class IplbLogsDataStreamsCtrl {
  $onInit() {
    this.logSubscriptionApiData = {
      url: this.url,
      params: {
        kind: this.kind,
      },
    };
  }
}
