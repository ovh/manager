import { ADDITIONAL_IP, ALERT_ID, IP_TYPE } from './ip-ip-agoraOrder.constant';

export default class AgoraIpOrderCtrl {
  /* @ngInject */
  constructor($q, $rootScope, $scope, $state) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.ADDITIONAL_IP = ADDITIONAL_IP;
    this.ALERT_ID = ALERT_ID;
    this.IP_TYPE = IP_TYPE;
  }

  $onInit() {
    this.loading = {};
    this.user = this.$state.params.user;
    this.ipType = this.$state.params.ipType || this.ipType;
  }

  goToIpv4Order() {
    this.$state.go('app.ip.agora-order.ipv4');
  }
}
