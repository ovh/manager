const MESSAGES_CONTAINER_NAME = 'pci.projects.project.additional-ips';

export default class AdditionalIpEditController {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.isLoading = false;
  }

  terminate() {
    this.isLoading = true;
    return this.terminateIp(this.serviceName, this.ip)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_additional_ips_floating_ips_floating_ip_terminate_success_info',
            {
              ip: this.ip,
            },
          ),
          'success',
        ),
      )
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_additional_ips_floating_ips_floating_ip_terminate_failure_info',
            {
              ip: this.ip,
              error: data.message,
            },
          ),
          MESSAGES_CONTAINER_NAME,
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
