import find from 'lodash/find';
import { getCriteria } from '../../project.utils';

import { OBJECT_CONTAINER_OFFERS_TYPES } from './containers.constants';

export default class PciStoragesContainersController {
  /* @ngInject */
  constructor(
    $translate,
    $http,
    CucCloudMessage,
    PciProjectStorageContainersService,
  ) {
    this.$translate = $translate;
    this.$http = $http;
    this.CucCloudMessage = CucCloudMessage;
    this.publicToggleLoading = false;
    this.OBJECT_CONTAINER_OFFERS_TYPES = OBJECT_CONTAINER_OFFERS_TYPES;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.containerId);
    this.publicToggleLoading = false;
    this.hasHighPerformanceStorage = this.hasHighPerformanceStorage();
    this.columnsParameters = [
      {
        name: 'id',
        hidden: !this.archive,
      },
      {
        name: 'creationDate',
        hidden: !this.coldArchive,
      },
      {
        name: 'region',
        hidden: this.coldArchive,
      },
      {
        name: 'containerType',
        hidden: this.coldArchive,
      },
      {
        name: 'offer',
        hidden: this.coldArchive,
      },
      {
        name: 'state',
        hidden: this.coldArchive,
      },
      {
        name: 'status',
        hidden: !this.coldArchive,
      },
      {
        name: 'cold-archive-actions',
        hidden: !this.coldArchive,
      },
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  getColdArchiveStatusBadge(state) {
    switch (state) {
      case 'none':
        return 'oui-badge oui-badge_sold-out';
      case 'locked':
        return 'oui-badge oui-badge_error';
      case 'archiving':
        return 'oui-badge oui-badge_info';
      case 'draining':
        return 'oui-badge oui-badge_info';
      case 'archived':
        return 'oui-badge oui-badge_success';
      case 'restoring':
        return 'oui-badge oui-badge_info';
      case 'restored':
        return 'oui-badge oui-badge_success';
      case 'deleting':
        return 'oui-badge oui-badge_warning';
      case 'flushed':
        return 'oui-badge oui-badge_error';
      default:
        return 'oui-badge';
    }
  }

  onPublicToggle(container) {
    this.loadingContainer = container.id;
    return this.PciProjectStorageContainersService.toggleContainerState(
      this.projectId,
      container,
    )
      .then(() =>
        this.CucCloudMessage.success(
          this.$translate.instant(
            container.state
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
        this.loadingContainer = null;
      });
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.containers.container',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  hasHighPerformanceStorage() {
    return find(this.containers, { isHighPerfStorage: true });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  isSwiftType(container) {
    return !this.archive && !container.s3StorageType;
  }
}
