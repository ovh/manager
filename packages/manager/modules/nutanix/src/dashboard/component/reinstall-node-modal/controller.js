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

    this.reinstallNode({
      version: this.version,
    })
      .then(() => {
        this.handleSuccess(
          `${this.$translate.instant(
            'nutanix_dashboard_reinstall_node_success_banner',
          )}`,
        );
      })
      .catch(() => {
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
}
