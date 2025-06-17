import {
  ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
  PREFIX_TRACKING_NUTANIX_NUTANIX,
  PREFIX_TRACKING_NUTANIX_NUTANIX_POPUP,
  PREFIX_TRACKING_NUTANIX_POPUP,
} from '../../../constants';

export default class NutanixDashboarInstallNodeModal {
  /* @ngInject */
  constructor(NutanixService, $translate, atInternet) {
    this.NutanixService = NutanixService;
    this.$translate = $translate;
    this.atInternet = atInternet;

    this.errorMessages = {
      ipSubnetValidator: this.$translate.instant(
        'nutanix_dashboard_install_ip_not_in_cidr_subnet_error',
      ),
      uniqueIpValidator: this.$translate.instant(
        'nutanix_dashboard_install_ip_unique_error',
      ),
      ipValidator: this.$translate.instant(
        'nutanix_dashboard_install_ip_format_error',
      ),
    };
  }

  $onInit() {
    this.atInternet.trackPage({
      name: `${PREFIX_TRACKING_NUTANIX_NUTANIX_POPUP}::cluster::nodes::install_node::${this.commercialRange}`,
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
    });
  }

  ipUnavailableWith(ip) {
    return [...this.ipUnavailable, ip];
  }

  onSubmit() {
    this.atInternet.trackClick({
      name: `${PREFIX_TRACKING_NUTANIX_POPUP}::button::install_node::confirm::${this.commercialRange}`,
      type: 'action',
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
    });
    if (this.installNodeForm.$invalid) {
      return;
    }

    this.isLoading = true;

    this.installNode({
      ahvIp: this.ahvIp,
      cvmIp: this.cvmIp,
      version: this.version,
    })
      .then(() => {
        this.atInternet.trackPage({
          name: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::banner-success::cluster::nodes::install-node-${this.commercialRange}_success`,
          level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
        });
        this.handleSuccess(
          `${this.$translate.instant(
            'nutanix_dashboard_install_node_success_banner',
          )}`,
        );
      })
      .catch(() => {
        this.atInternet.trackPage({
          name: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::banner-error::cluster::nodes::install-node-${this.commercialRange}_error`,
          level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
        });
        this.handleError(
          this.$translate.instant(
            'nutanix_dashboard_install_node_error_banner',
          ),
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onCancel() {
    this.atInternet.trackClick({
      name: `${PREFIX_TRACKING_NUTANIX_POPUP}::button::install_node::cancel::${this.commercialRange}`,
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
      type: 'action',
    });
    this.goBack();
  }
}
