import set from 'lodash/set';

export default class PciStoragesContainersController {
  /* @ngInject */
  constructor($translate, $http, CucCloudMessage) {
    this.$translate = $translate;
    this.$http = $http;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
    this.publicToggleLoading = false;
  }

  onPublicToggle(container) {
    set(container, 'publicToggleLoading', true);
    return this.$http
      .put(`/cloud/project/${this.projectId}/storage/${container.id}`, {
        containerType: container.publicState ? 'private' : 'public',
      })
      .then(() =>
        this.CucCloudMessage.success(
          this.$translate.instant(
            container.publicState
              ? 'pci_projects_project_storages_containers_toggle_private_succeed'
              : 'pci_projects_project_storages_containers_toggle_public_succeed',
            { name: container.name },
          ),
          'pci.projects.project.storages.containers.container',
        ),
      )
      .catch((error) =>
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_toggle_fail',
            { message: error.data?.message },
          ),
          'pci.projects.project.storages.containers.container',
        ),
      )
      .finally(() => {
        set(container, 'publicToggleLoading', false);
      });
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.containers',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
