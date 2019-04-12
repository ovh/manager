import get from 'lodash/get';

export default class PciBlockStorageContainersContainerObjectAddController {
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
    this.prefix = '/';
    this.files = [];

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
            `pci_projects_project_storages_containers_container_object_add_${this.archive ? 'archive' : 'object'}_error_load`,
            { message: get(err, 'data.message', '') },
          ),
          'pci.projects.project.storages.containers.container.object.add',
        );
      })
      .finally(() => {
        this.loadings.init = false;
      });
  }

  loadMessages() {
    return new Promise((resolve) => {
      this.CucCloudMessage.unSubscribe('pci.projects.project.storages.containers.container.object.add');
      this.messageHandler = this.CucCloudMessage.subscribe(
        'pci.projects.project.storages.containers.container.object.add',
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

  addObjects() {
    this.loadings.save = true;
    return this.PciProjectStorageContainersService
      .addObjects(this.projectId, this.container, this.prefix, this.files)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            `pci_projects_project_storages_containers_container_object_add_${this.archive ? 'archive' : 'object'}_success_message`,
          ),
          'pci.projects.project.storages.containers.container',
        );
        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            `pci_projects_project_storages_containers_container_object_add_${this.archive ? 'archive' : 'object'}_error_delete`,
            {
              message: get(err, 'data.message', null),
            },
          ),
          'pci.projects.project.storages.containers.container.object.add',
        );
      })
      .finally(() => {
        this.loadings.save = false;
      });
  }
}
