import get from 'lodash/get';

export default class PciBlockStorageDetailsDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciProjectStorageContainersService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.loadings = {
      init: false,
      save: false,
    };

    this.initLoaders();
  }

  initLoaders() {
    this.loadings.init = true;
    return this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.PciProjectStorageContainersService
        .getContainer(this.projectId, this.containerId))
      .then((container) => {
        this.container = container;
        return this.container;
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_delete_error_load',
            { message: get(err, 'data.message', '') },
          ),
          'pci.projects.project.storages.containers.delete',
        );
      })
      .finally(() => {
        this.loadings.init = false;
      });
  }

  loadMessages() {
    return new Promise((resolve) => {
      this.CucCloudMessage.unSubscribe('pci.projects.project.storages.containers.delete');
      this.messageHandler = this.CucCloudMessage.subscribe(
        'pci.projects.project.storages.containers.delete',
        {
          onMessage: () => this.refreshMessages(),
        },
      );
      resolve();
    });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  deleteStorage() {
    this.loadings.save = true;
    return this.PciProjectStorageContainersService
      .deleteContainer(this.projectId, this.container)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_delete_success_message',
            {
              container: this.container.name,
            },
          ),
          'pci.projects.project.storages.containers',
        );
        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_delete_error_delete',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'pci.projects.project.storages.containers.delete',
        );
      })
      .finally(() => {
        this.loadings.save = false;
      });
  }
}
