export default class OverTheBoxLogsCtrl {
  /* @ngInject */
  constructor(OvhApiOverTheBox, TailLogs) {
    this.OvhApiOverTheBox = OvhApiOverTheBox;
    this.TailLogs = TailLogs;
  }

  $onInit() {
    this.logger = new this.TailLogs({
      source: () =>
        this.OvhApiOverTheBox.v6()
          .getLogs(
            {
              serviceName: this.serviceName,
            },
            {},
          )
          .$promise.then((logs) => logs.url),
      delay: 2000,
    });

    this.startLog();
  }

  stopLog() {
    this.logger.stop();
  }

  startLog() {
    this.logger.log();
  }

  getLogs() {
    this.logger = this.logger.logs;
    return this.logger;
  }

  $onDestroy() {
    this.logger.stop();
  }
}
