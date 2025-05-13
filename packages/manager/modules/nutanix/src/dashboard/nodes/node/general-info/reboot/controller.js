import { NUTANIX_NODE_STATUS } from '../constants';

export default class NutanixNodeRebootCtrl {
  /* @ngInject */
  constructor($translate, NutanixNode, $rootScope, atInternet) {
    this.$translate = $translate;
    this.NutanixNode = NutanixNode;
    this.$rootScope = $rootScope;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.server = this.node;
    this.isRebooting = false;
  }

  reboot() {
    this.isRebooting = true;
    this.trackClick('confirm');
    return this.NutanixNode.reboot(this.nodeId)
      .then((task) => {
        this.$rootScope.$broadcast('nutanix.node.reboot', task);
        this.goBack(
          this.$translate.instant('nutanix_node_reboot_success', {
            nodeName: this.node.displayName,
          }),
          NUTANIX_NODE_STATUS.DONE,
          false,
        );
      })
      .catch((error) => {
        this.isRebooting = false;
        this.goBack(
          this.$translate.instant('nutanix_node_reboot_error', {
            message: error?.message || error.data?.message,
          }),
          'error',
        );
      });
  }

  onCancel() {
    this.trackClick('cancel');
    this.goBack();
  }

  trackClick(trackText) {
    return this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${trackText}`,
      type: 'action',
    });
  }
}
