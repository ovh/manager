import {
  TRACKING_PREFIX,
  IP_AGORA,
  ADDITIONAL_IP,
  ALERT_ID,
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
  }

  $onInit() {
    this.loading = {};
    this.user = this.$state.params.user;
  }

  resumeOrder() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}cancel`,
      type: 'action',
    });
    return this.$state.go('^');
  }
}
