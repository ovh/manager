import get from 'lodash/get';

import { CONTAINER_DEFAULT_USER } from '../containers.constants';

export default class PciStoragesContainersContainerController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $window,
    CucCloudMessage,
    PciProjectStorageContainersService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;

    this.defaultUser = CONTAINER_DEFAULT_USER;
  }

  $onInit() {
    this.columnsParameters = [
      {
        name: 'retrievalState',
        hidden: !this.archive,
      },
    ];

    this.loadMessages();
  }

  loadMessages() {
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
    let downloadPromise = null;
    if (object.isHighPerfStorage) {
      downloadPromise = this.downloadHighPerfObject(
        this.projectId,
        this.container.region,
        this.container.name,
        object,
      );
    } else {
      downloadPromise = this.PciProjectStorageContainersService.downloadObject(
        this.projectId,
        this.containerId,
        object,
      );
    }
    return downloadPromise
      .then((url) => {
        this.$window.location = url;
      })
      .catch((err) => this.handleDownloadError(err));
  }

  downloadHighPerfObject(serviceName, regionName, containerName, object) {
    return this.PciProjectStorageContainersService.downloadHighPerfObject(
      serviceName,
      regionName,
      containerName,
      object,
    ).then(({ url }) => url);
  }

  handleDownloadError(err) {
    this.CucCloudMessage.error(
      this.$translate.instant(
        `pci_projects_project_storages_containers_container_${
          this.archive ? 'archive' : 'object'
        }_error_download`,
        { message: get(err, 'data.message', '') },
      ),
      'pci.projects.project.storages.containers.container',
    );
  }

  unsealObject(object) {
    return this.PciProjectStorageContainersService.unsealObject(
      this.projectId,
      this.container,
      object,
    )
      .then(() =>
        this.refresh(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_archive_success_unseal',
            {
              archive: object.name,
            },
          ),
        ),
      )
      .catch((err) =>
        this.refresh(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_archive_error_unseal',
            {
              message: get(err, 'data.message', ''),
            },
          ),
          'error',
        ),
      );
  }
}
