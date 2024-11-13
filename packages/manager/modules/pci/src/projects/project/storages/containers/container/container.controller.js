import get from 'lodash/get';

import {
  CONTAINER_DEFAULT_USER,
  CONTAINER_GUIDES,
  OBJECT_CONTAINER_S3_STATIC_URL_INFO,
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
} from '../containers.constants';

export default class PciStoragesContainersContainerController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $window,
    coreConfig,
    atInternet,
    CucCloudMessage,
    PciProjectStorageContainersService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;

    this.guides = CONTAINER_GUIDES.map((guide) => ({
      ...guide,
      title: $translate.instant(
        `pci_projects_project_storages_containers_container_documentation_title_${guide.id}`,
      ),
      description: $translate.instant(
        `pci_projects_project_storages_containers_container_documentation_description_${guide.id}`,
      ),
      link:
        guide.links[coreConfig.getUser().ovhSubsidiary] ||
        guide.links[guide.links.DEFAULT],
    }));
    this.defaultUser = CONTAINER_DEFAULT_USER;
    this.objectS3staticUrlInfo = OBJECT_CONTAINER_S3_STATIC_URL_INFO;
  }

  $onInit() {
    this.translateStorageClass();
    this.columnsParameters = [
      {
        name: 'retrievalState',
        hidden: !this.archive,
      },
      {
        name: 'contentType',
        hidden: this.container.s3StorageType,
      },
      {
        name: 'storageClass',
        hidden: !this.container.s3StorageType,
      },
    ];
    this.displayEncryptionData =
      this.encryptionAvailable &&
      this.container.s3StorageType !== null &&
      !this.archive;
    this.loadMessages();
  }

  isLocalZone() {
    return (
      this.container?.regionDetails?.type === OBJECT_CONTAINER_MODE_LOCAL_ZONE
    );
  }

  translateStorageClass() {
    this.container.objects = this.container.objects.map((object) => ({
      ...object,
      storageClass: this.$translate.instant(
        `pci_projects_project_storages_containers_container_storage_class_${object.storageClass}`,
      ),
    }));
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
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}object::download-file`,
      type: 'action',
    });
    let downloadPromise = null;
    if (object.s3StorageType) {
      downloadPromise = this.downloadStandardS3Object(
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
        this.$window.top.location = url;
      })
      .catch((err) => this.handleDownloadError(err));
  }

  downloadStandardS3Object(serviceName, regionName, containerName, object) {
    return this.PciProjectStorageContainersService.downloadStandardS3Object(
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

  onDocumentationClick(guide) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}object::documentation::${guide.id}`,
      type: 'action',
    });
  }

  isRightOffer() {
    return this.container.s3StorageType;
  }
}
