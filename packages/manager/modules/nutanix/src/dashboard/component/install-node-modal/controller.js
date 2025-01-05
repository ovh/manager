import { IPV4_REGEX } from '../../constants';

export default class NutanixDashboarInstallNodeModal {
  /* @ngInject */
  constructor(NutanixService, $translate) {
    this.IPV4_REGEX = IPV4_REGEX;
    this.NutanixService = NutanixService;
    this.$translate = $translate;

    this.errorMessages = {
      ipSubnetValidator: this.$translate.instant(
        'nutanix_dashboard_install_ip_not_in_cidr_subnet_error',
      ),
      uniqueIpValidator: this.$translate.instant(
        'nutanix_dashboard_install_ip_unique_error',
      ),
      pattern: this.$translate.instant(
        'nutanix_dashboard_install_ip_format_error',
      ),
    };
  }

  onSubmit() {
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
        this.handleSuccess(
          `${this.$translate.instant(
            'nutanix_dashboard_install_node_success_banner',
          )}`,
        );
      })
      .catch((error) => {
        this.handleError(
          `${this.$translate.instant(
            'nutanix_dashboard_install_node_error_banner',
          )} ${error.message}`,
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
