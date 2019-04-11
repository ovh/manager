import get from 'lodash/get';

export default class PciBlockStorageContainersContainerObjectDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    CucCloudMessage,
    PciProjectStorageContainersService,
  ) {
    this.$translate = $translate;
    this.$window = $window;
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
        .getObject(this.projectId, this.containerId, this.objectId))
      .then(({ container, object }) => {
        this.object = object;
        this.container = container;

        return this.object;
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            `pci_projects_project_storages_containers_container_object_delete_${this.archive ? 'archive' : 'object'}_error_load`,
            { message: get(err, 'data.message', '') },
          ),
          'pci.projects.project.storages.containers.container.object.delete',
        );
      })
      .finally(() => {
        this.loadings.init = false;
      });
  }

  loadMessages() {
    return new Promise((resolve) => {
      this.CucCloudMessage.unSubscribe('pci.projects.project.storages.containers.container.object.delete');
      this.messageHandler = this.CucCloudMessage.subscribe(
        'pci.projects.project.storages.containers.container.object.delete',
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

  deleteObject() {
    this.loadings.save = true;
    return this.PciProjectStorageContainersService
      .deleteObject(this.projectId, this.container, this.object)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            `pci_projects_project_storages_containers_container_object_delete_${this.archive ? 'archive' : 'object'}_success_message`,
            {
              object: this.object.name,
            },
          ),
          'pci.projects.project.storages.containers.container',
        );
        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            `pci_projects_project_storages_containers_container_object_delete_${this.archive ? 'archive' : 'object'}_error_delete`,
            {
              message: get(err, 'data.message', null),
            },
          ),
          'pci.projects.project.storages.containers.container.object.delete',
        );
      })
      .finally(() => {
        this.loadings.save = false;
      });
  }
}
