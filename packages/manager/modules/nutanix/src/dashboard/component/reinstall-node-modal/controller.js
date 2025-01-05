export default class NutanixDashboardReinstallNodeCtrl {
  /* @ngInject */
  constructor(NutanixService, $translate) {
    this.NutanixService = NutanixService;
    this.$translate = $translate;
    this.errorIpMessage = {
      notValidIp: $translate.instant(
        'nutanix_dashboard_reinstall_form_not_valid_ip_error',
      ),
      notPrivateIp: $translate.instant(
        'nutanix_dashboard_reinstall_form_not_private_ip_error',
      ),
    };
  }

  onSubmit() {
    if (this.reinstallNodeForm.$invalid) {
      return;
    }

    this.isLoading = true;

    this.installNode({
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
