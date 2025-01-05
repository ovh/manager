export default class NutanixDashboarInstallNodeModal {
  /* @ngInject */
  constructor(NutanixService, $translate) {
    this.NutanixService = NutanixService;
    this.$translate = $translate;

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

  ipUnavailableWith(ip) {
    return [...this.ipUnavailable, ip];
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
      .catch(() => {
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
}
