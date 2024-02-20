import { LOG_KEYS, DATA_PLATFORM_GUIDE } from '../constants';

export default class LogToCustomerCtrl {
  /* @ngInject */
  constructor($translate, LogToCustomerService, coreConfig, coreURLBuilder) {
    this.$translate = $translate;
    this.LOG_KEYS = LOG_KEYS;
    this.LogToCustomer = LogToCustomerService;
    this.user = coreConfig.getUser();
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.loading = true;
    this.dbaasLogsURL = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/dbaas/logs',
    );
    this.links = {
      logPlatformGuide:
        DATA_PLATFORM_GUIDE[this.user.ovhSubsidiary] ||
        DATA_PLATFORM_GUIDE.DEFAULT,
      logInfo: this.logServiceGuideLink,
      createStream: this.dbaasLogsURL,
      createAccount: `${this.dbaasLogsURL}/order`,
    };

    this.hasAtLeastOneDataStream = false;

    this.LogToCustomer.getDataStreams()
      .then(({ streams, streamCount }) => {
        this.logAccountStreams = streams;
        this.hasAtLeastOneDataStream = streamCount > 0;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
