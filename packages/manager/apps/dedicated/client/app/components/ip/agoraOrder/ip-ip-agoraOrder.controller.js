import {
  ADDITIONAL_IP,
  FUNNEL_TRACKING_PREFIX,
  DASHBOARD_STATE_NAME,
  ALERT_ID,
  IP_TYPE,
  IP_TYPE_TITLE,
  IP_FAILOVER_PLANCODE,
} from './ip-ip-agoraOrder.constant';

export default class AgoraIpOrderCtrl {
  /* @ngInject */
  constructor($q, $rootScope, $scope, $state, ipCatalog, atInternet) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.atInternet = atInternet;
    this.ADDITIONAL_IP = ADDITIONAL_IP;
    this.ALERT_ID = ALERT_ID;
    this.IP_TYPE = IP_TYPE;
    this.IP_TYPE_TITLE = IP_TYPE_TITLE;
    this.ipCatalog = ipCatalog;
  }

  $onInit() {
    this.loading = {};
    this.user = this.$state.params.user;
    this.ipType = this.$state.params.ipType || this.ipType;
    this.getlowestPrice();
  }

  getlowestPrice() {
    const plans = this.ipCatalog?.filter((plan) =>
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
    this.atInternet.trackClick({
      name: `${FUNNEL_TRACKING_PREFIX}tile::add_additional_ip::select_version::next_ipv4`,
      type: 'action',
      level2: 57,
    });
    this.$state.go('app.ip.agora-order.ipv4');
  }

  goToIpv6Order() {
    this.atInternet.trackClick({
      name: `${FUNNEL_TRACKING_PREFIX}tile::add_additional_ip::select_version::next_ipv6`,
      type: 'action',
      level2: 57,
    });
    this.$state.go('app.ip.agora-order.ipv6');
  }

  resumeOrder() {
    this.atInternet.trackClick({
      name: `${FUNNEL_TRACKING_PREFIX}link::back_previous_page`,
      type: 'action',
      level2: 57,
    });
    return this.$state.go(DASHBOARD_STATE_NAME);
  }
}
