import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, PciPrivateNetworks) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciPrivateNetworks = PciPrivateNetworks;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deleteSubnet() {
    this.trackPrivateNetworks('delete::confirm');
    this.isDeleting = true;
    return this.PciPrivateNetworks.deleteSubnet(
      this.projectId,
      this.region,
      this.networkId,
    )
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_network_private_delete_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_network_private_delete_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isDeleting = false;
      });
  }
}
