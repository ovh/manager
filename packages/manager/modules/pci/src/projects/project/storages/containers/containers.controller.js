import get from 'lodash/get';

export default class PciStoragesContainersController {
  /* @ngInject */
  constructor(
    $rootScope,
    $translate,
    CucCloudMessage,
    PciProjectStorageContainersService,
  ) {
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.$rootScope.$on('pci_storages_containers_refresh', () => this.refreshContainers());

    this.containers = null;

    this.loading = true;
    return this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.getContainers())
      .finally(() => {
        this.loading = false;
      });
  }

  getContainers() {
    return this.PciProjectStorageContainersService.getAll(this.projectId, this.archive)
      .then((containers) => {
        this.containers = containers;
      })
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_containers_error_query',
          { message: get(err, 'data.message', '') },
        ),
      ));
  }

  refreshContainers() {
    this.loading = true;
    return this.getContainers()
      .finally(() => {
        this.loading = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.containers');
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
