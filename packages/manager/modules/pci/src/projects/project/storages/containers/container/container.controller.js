import get from 'lodash/get';

import { CONTAINER_DEFAULT_USER } from '../containers.constants';

export default class PciStoragesContainersContainerController {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $translate,
    $window,
    CucCloudMessage,
    PciProjectStorageContainersService,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;

    this.defaultUser = CONTAINER_DEFAULT_USER;
  }

  $onInit() {
    this.$rootScope.$on('pci_storages_containers_container_refresh', () => this.refreshContainer());

    this.columnsParameters = [{
      name: 'retrievalState',
      hidden: !this.archive,
    }];

    this.containers = null;

    this.isLoading = true;
    return this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.getContainer())
      .then(() => this.getContainerPassword())
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          `pci_projects_project_storages_containers_container_${this.archive ? 'archive' : 'object'}_error_query`,
          { message: get(err, 'data.message', '') },
        ),
        'pci.projects.project.storages.containers.container',
      ))
      .finally(() => {
        this.isLoading = false;
      });
  }

  getContainerPassword() {
    if (this.archive) {
      return this.PciProjectStorageContainersService
        .getArchivePassword(this.projectId, this.container)
        .then((password) => {
          this.defaultPassword = password;
        });
    }
    return this.$q.resolve();
  }

  getContainer() {
    return this.PciProjectStorageContainersService
      .getContainer(this.projectId, this.containerId)
      .then((container) => {
        this.container = container;
      });
  }

  refreshContainer() {
    this.isLoading = true;
    return this.getContainer()
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          `pci_projects_project_storages_containers_container_${this.archive ? 'archive' : 'object'}_error_query`,
          { message: get(err, 'data.message', '') },
        ),
        'pci.projects.project.storages.containers.container',
      ))
      .finally(() => {
        this.isLoading = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.containers.container');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.containers.container',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  downloadObject(object) {
    return this.PciProjectStorageContainersService
      .downloadObject(this.projectId, this.containerId, object)
      .then((url) => {
        this.$window.location = url;
      })
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          `pci_projects_project_storages_containers_container_${this.archive ? 'archive' : 'object'}_error_download`,
          { message: get(err, 'data.message', '') },
        ),
        'pci.projects.project.storages.containers.container',
      ));
  }

  unsealObject(object) {
    return this.PciProjectStorageContainersService
      .unsealObject(this.projectId, this.container, object)
      .then(() => this.refreshContainer())
      .then(() => this.CucCloudMessage.success(
        this.$translate.instant(
          'pci_projects_project_storages_containers_container_archive_success_unseal',
          {
            archive: object.name,
          },
        ),
        'pci.projects.project.storages.containers.container',
      ))
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_containers_container_archive_error_unseal',
          { message: get(err, 'data.message', '') },
        ),
        'pci.projects.project.storages.containers.container',
      ));
  }
}
