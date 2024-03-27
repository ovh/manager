import {
  TRACKING_PREFIX,
  IP_AGORA,
  ADDITIONAL_IP,
  ALERT_ID,
  IP_TYPE,
} from './ip-ip-agoraOrder.constant';

export default class AgoraIpOrderCtrl {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $scope,
    $state,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.IP_AGORA = IP_AGORA;
    this.ADDITIONAL_IP = ADDITIONAL_IP;
    this.ALERT_ID = ALERT_ID;
    this.IP_TYPE = IP_TYPE;
  }

  $onInit() {
    this.loading = {};
    this.user = this.$state.params.user;
  }
  
  goToIpv6Order() {
    this.$state.go('app.ip.agora-order.ipv6')
  }

  goToIpv4Order() {
    this.$state.go('app.ip.agora-order.ipv4')
  }

  resumeOrder() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}cancel`,
      type: 'action',
    });
    return this.$state.go('^');
  }
}
