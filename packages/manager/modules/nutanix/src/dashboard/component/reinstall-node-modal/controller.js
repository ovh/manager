import {
  PREFIX_TRACKING_NUTANIX_NUTANIX,
  PREFIX_TRACKING_NUTANIX_POPUP,
  PREFIX_TRACKING_NUTANIX_NUTANIX_POPUP,
  ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
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
      name: `${PREFIX_TRACKING_NUTANIX_NUTANIX_POPUP}::cluster::nodes::reinstall_node::${this.commercialRange}`,
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
    });
  }

  onSubmit() {
    this.atInternet.trackClick({
      name: `${PREFIX_TRACKING_NUTANIX_POPUP}::button::reinstall_node::confirm::${this.commercialRange}`,
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
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
          name: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::banner-success::cluster::nodes::reinstall-node-${this.commercialRange}_success`,
          level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
        });
        this.handleSuccess(
          `${this.$translate.instant(
            'nutanix_dashboard_reinstall_node_success_banner',
          )}`,
        );
      })
      .catch(() => {
        this.atInternet.trackPage({
          name: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::banner-error::cluster::nodes::reinstall-node-${this.commercialRange}_error`,
          level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
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
      name: `${PREFIX_TRACKING_NUTANIX_POPUP}::button::reinstall_node::cancel::${this.commercialRange}`,
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
      type: 'action',
    });
    this.goBack();
  }
}
