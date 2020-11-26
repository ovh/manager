import grafana from '../../assets/grafana.png';
import graylog from '../../assets/graylog.png';
import kibana from '../../assets/kibana.png';

export default class LogsWelcomeCtrl {
  /* @ngInject */
  constructor(
    $state,
    LogsConstants,
    CucOrderHelperService,
    ovhDocUrl,
    coreConfig,
  ) {
    this.$state = $state;
    this.region = coreConfig.getRegion();
    this.LogsConstants = LogsConstants;
    this.CucOrderHelperService = CucOrderHelperService;
    this.ovhDocUrl = ovhDocUrl;
    this.urls = {};

    this.assets = {
      grafana,
      graylog,
      kibana,
    };
  }

  $onInit() {
    this.urls.docsUrl = this.ovhDocUrl.getDocUrl(
      this.LogsConstants.LOGS_DOCS_NAME,
    );
    this.CucOrderHelperService.buildUrl(
      this.LogsConstants.LOGS_PRODUCT_URL,
    ).then((url) => {
      this.urls.productURL = url;
    });
    this.CucOrderHelperService.buildUrl(this.LogsConstants.ORDER_URL).then(
      (url) => {
        this.urls.orderURL = url;
      },
    );
  }
}
