import {
  PREFIX_TRACKING_NUTANIX_NUTANIX,
  PREFIX_TRACKING_NUTANIX_POPUP,
  PREFIX_TRACKING_NUTANIX_NUTANIX_POPUP,
} from '../../../constants';

export default class NutanixDashboardReinstallNodeCtrl {
  /* @ngInject */
  constructor(NutanixService, $translate, atInternet) {
    this.NutanixService = NutanixService;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.errorIpMessage = {
      notValidIp: $translate.instant(
        'nutanix_dashboard_reinstall_form_not_valid_ip_error',
      ),
      notPrivateIp: $translate.instant(
        'nutanix_dashboard_reinstall_form_not_private_ip_error',
      ),
    };
  }

  $onInit() {
    this.atInternet.trackPage({
      name: `${PREFIX_TRACKING_NUTANIX_NUTANIX_POPUP}::cluster::nodes::reinstall_node::${this.nodeId}`,
    });
  }

  onSubmit() {
    this.atInternet.trackClick({
      name: `${PREFIX_TRACKING_NUTANIX_POPUP}::button::reinstall_node::confirm::${this.nodeId}`,
      type: 'action',
    });
    if (this.reinstallNodeForm.$invalid) {
      return;
    }

    this.isLoading = true;

    this.reinstallNode({
      version: this.version,
    })
      .then(() => {
        this.atInternet.trackPage({
          name: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::banner-success::cluster::nodes::reinstall-node-${this.nodeId}_success`,
        });
        this.handleSuccess(
          `${this.$translate.instant(
            'nutanix_dashboard_reinstall_node_success_banner',
          )}`,
        );
      })
      .catch(() => {
        this.atInternet.trackPage({
          name: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::banner-error::cluster::nodes::reinstall-node-${this.nodeId}_error`,
        });
        this.handleError(
          this.$translate.instant(
            'nutanix_dashboard_reinstall_node_error_banner',
          ),
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onCancel() {
    this.atInternet.trackClick({
      name: `${PREFIX_TRACKING_NUTANIX_POPUP}::button::reinstall_node::cancel::${this.nodeId}`,
      type: 'action',
    });
    this.goBack();
  }
}
