import grafanaImage from '../../assets/grafana.png';
import graylogImage from '../../assets/graylog.png';
import kibanaImage from '../../assets/kibana.png';

export default class LogsWelcomeCtrl {
  /* @ngInject */
  constructor(
    $state,
    DbaasLogsConstants,
    CucOrderHelperService,
    ovhDocUrl,
    coreConfig,
  ) {
    this.$state = $state;
    this.region = coreConfig.getRegion();
    this.DbaasLogsConstants = DbaasLogsConstants;
    this.CucOrderHelperService = CucOrderHelperService;
    this.ovhDocUrl = ovhDocUrl;
    this.urls = {};
    this.grafanaImage = grafanaImage;
    this.graylogImage = graylogImage;
    this.kibanaImage = kibanaImage;
  }

  $onInit() {
    this.urls.docsUrl = this.ovhDocUrl.getDocUrl(
      this.DbaasLogsConstants.LOGS_DOCS_NAME,
    );
    this.CucOrderHelperService.buildUrl(
      this.DbaasLogsConstants.LOGS_PRODUCT_URL,
    ).then((url) => {
      this.urls.productURL = url;
    });
    this.CucOrderHelperService.buildUrl(this.DbaasLogsConstants.ORDER_URL).then(
      (url) => {
        this.urls.orderURL = url;
      },
    );
  }
}
