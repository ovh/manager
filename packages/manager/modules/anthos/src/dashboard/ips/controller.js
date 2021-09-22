import { DATAGRID_CONFIG } from './constant';

export default class AnthosIPsCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.DATAGRID_CONFIG = DATAGRID_CONFIG;
  }

  onGoToRemovePrivateIp(privateIp) {
    this.trackClick(`${this.ipHitTracking}::delete-ip-range`);

    return this.goToRemovePrivateIp(privateIp);
  }

  onGoToAssignPrivateIp() {
    this.trackClick(`${this.ipHitTracking}::assign-private-ip`);

    return this.goToAssignPrivateIp();
  }

  onGoToOrderPublicIp() {
    this.trackClick(`${this.ipHitTracking}::order-public-ip`);

    return this.goToOrderPublicIp();
  }
}
