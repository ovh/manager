import {
  ADDITIONAL_IP,
  TRACKING_PREFIX,
  DASHBOARD_STATE_NAME,
  ALERT_ID,
  IP_TYPE,
  IP_TYPE_TITLE,
  IP_FAILOVER_PLANCODE,
  SURVEY_LANGUAGES,
  BASE_URL_SURVEY,
} from './ip-ip-agoraOrder.constant';

export default class AgoraIpOrderCtrl {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $scope,
    $state,
    ipCatalog,
    atInternet,
    coreConfig,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.atInternet = atInternet;
    this.ADDITIONAL_IP = ADDITIONAL_IP;
    this.ALERT_ID = ALERT_ID;
    this.IP_TYPE = IP_TYPE;
    this.IP_TYPE_TITLE = IP_TYPE_TITLE;
    this.SURVEY_LANGUAGES = SURVEY_LANGUAGES;
    this.BASE_URL_SURVEY = BASE_URL_SURVEY;
    this.ipCatalog = ipCatalog;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.loading = {};
    this.user = this.$state.params.user;
    this.ipType = this.$state.params.ipType || this.ipType;
    this.getlowestPrice();
    const userLanguage = this.coreConfig.getUserLanguage();
    const languageToUse = this.SURVEY_LANGUAGES.ALLOWED.includes(userLanguage)
      ? userLanguage
      : this.SURVEY_LANGUAGES.DEFAULT;
    // Get user
    const user = this.coreConfig.getUser();

    // Build url for survey link
    this.surveyUrl = `${this.BASE_URL_SURVEY}${languageToUse}&nic=${user.nichandle}`;
  }

  getlowestPrice() {
    const plans = this.ipCatalog.filter((plan) =>
      Object.values(IP_FAILOVER_PLANCODE).includes(plan.planCode),
    );
    plans.forEach(
      ({
        details: {
          pricings: {
            default: [defaultPricing],
          },
        },
      }) => {
        if (
          !this.lowestIpV4Price ||
          defaultPricing.priceInUcents < this.lowestIpV4Price
        ) {
          this.lowestIpV4Price = defaultPricing.priceInUcents;
        }
      },
    );
  }

  goToIpv4Order() {
    this.$state.go('app.ip.agora-order.ipv4');
  }

  goToIpv6Order() {
    this.atInternet.trackClick({
      name: `dedicated::ip::dashboard::order`,
      type: 'action',
    });

    this.$state.go('app.ip.agora-order.ipv6');
  }

  resumeOrder() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}cancel`,
      type: 'action',
    });
    return this.$state.go(DASHBOARD_STATE_NAME);
  }
}
