import {
  ADDITIONAL_IP,
  ALERT_ID,
  IP_TYPE,
  IP_FAILOVER_PLANCODE,
} from './ip-ip-agoraOrder.constant';

export default class AgoraIpOrderCtrl {
  /* @ngInject */
  constructor($q, $rootScope, $scope, $state, ipCatalog) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.ADDITIONAL_IP = ADDITIONAL_IP;
    this.ALERT_ID = ALERT_ID;
    this.IP_TYPE = IP_TYPE;
    this.ipCatalog = ipCatalog;
  }

  $onInit() {
    this.loading = {};
    this.user = this.$state.params.user;
    this.ipType = this.$state.params.ipType || this.ipType;
    this.getlowestPrice();
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
}
