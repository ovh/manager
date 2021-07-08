export default class PciStoragesContainersController {
  /* @ngInject */
  constructor($translate, $http, CucCloudMessage) {
    this.$translate = $translate;
    this.$http = $http;
    this.CucCloudMessage = CucCloudMessage;
    this.publicToggleLoading = false;
  }

  $onInit() {
    this.loadMessages();
  }

  onPublicToggle(data) {
    this.publicToggleLoading = true;
    return this.$http
      .put(`/cloud/project/${this.projectId}/storage/${data.id}`, {
        containerType: data.public ? 'private' : 'public',
      })
      .then(() =>
        this.CucCloudMessage.success(
          this.$translate.instant(
            data.public
              ? 'pci_projects_project_storages_containers_toggle_private_succeed'
              : 'pci_projects_project_storages_containers_toggle_public_succeed',
            { name: data.name },
          ),
          'pci.projects.project.storages.containers.container',
        ),
      )
      .catch((err) =>
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_toggle_fail',
            {
              message: err.message || err.data?.message,
            },
          ),
          'pci.projects.project.storages.containers.container',
        ),
      )
      .finally(() => {
        this.publicToggleLoading = false;
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
