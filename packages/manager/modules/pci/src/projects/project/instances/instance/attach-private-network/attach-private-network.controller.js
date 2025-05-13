import get from 'lodash/get';

export default class PciInstanceAttachPrivateNetworkController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, PciProjectsProjectInstanceService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.selectedPrivateNetworks = [];
    this.selectedLocalPrivateNetworks = [];
    this.isLoading = false;
  }

  attachPrivateNetworks(privateNetworks) {
    this.isLoading = true;

    return this.PciProjectsProjectInstanceService.attachPrivateNetworks(
      this.projectId,
      this.instance,
      privateNetworks,
    )
      .then(() => {
        let message;
        if (privateNetworks.length > 1) {
          message = this.$translate.instant(
            'pci_projects_project_instances_instance_attach-private-network_success_multiple_message',
            {
              instance: this.instance.name,
            },
          );
        } else {
          message = this.$translate.instant(
            'pci_projects_project_instances_instance_attach-private-network_success_message',
            {
              network: privateNetworks[0].name,
              instance: this.instance.name,
            },
          );
        }
        return this.goBack(message);
      })
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_attach-private-network_error_attach',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
