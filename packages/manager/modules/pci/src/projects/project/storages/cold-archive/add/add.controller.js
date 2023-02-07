import {
  COLD_ARCHIVE_TRACKING,
  COLD_ARCHIVE_STATES,
} from '../cold-archives.constants';

export default class ColdArchiveConfigurationController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciStoragesColdArchiveService,
    atInternet,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.cucCloudMessage = CucCloudMessage;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isArchiveCreationInProgress = false;
    this.archiveModel = { name: '', ownerId: null };
    this.userModel = {
      linkedMode: {
        selected: null,
        credential: null,
        isInProgress: false, // HTTP request
      },
      createMode: {
        user: null,
        credential: null,
        description: null,
        isInProgress: false, // HTTP request
      },
      createOrLinkedMode: null,
    };
    this.loadMessages();
    this.setUsersForContainerCreation();
  }

  trackAddContainerClick(action) {
    this.atInternet.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}::${action}`,
      type: 'click',
    });
  }

  trackAddContainerPage(action) {
    this.atInternet.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}_${action}`,
      type: 'navigation',
    });
  }

  loadMessages() {
    this.cucCloudMessage.unSubscribe(COLD_ARCHIVE_STATES.CONTAINER_ADD);
    this.messageHandler = this.cucCloudMessage.subscribe(
      COLD_ARCHIVE_STATES.CONTAINER_ADD,
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  setUsersForContainerCreation() {
    this.users = this.allUserList.filter((user) => user.status === 'ok');
  }

  getUserOwnerId() {
    const { createMode, linkedMode } = this.userModel;

    return createMode.user?.id || linkedMode.selected?.id;
  }

  getUserName() {
    const { createMode, linkedMode } = this.userModel;

    return createMode.user?.description || linkedMode.selected?.description;
  }

  getNameArchiveStepHeader(display) {
    if (display === false) {
      return this.$translate.instant(
        'pci_projects_project_storages_cold_archive_add_step_name_archive_header_selected',
        {
          archiveName: this.archiveModel.name,
        },
      );
    }

    return this.$translate.instant(
      'pci_projects_project_storages_cold_archive_add_step_name_archive_header',
    );
  }

  isReadyForValidation() {
    const { createMode, linkedMode, createOrLinkedMode } = this.userModel;

    return (
      createOrLinkedMode &&
      ((createMode.user && createMode.description) || linkedMode.selected)
    );
  }

  createArchive() {
    this.isArchiveCreationInProgress = true;
    return this.pciStoragesColdArchiveService
      .createArchiveContainer(this.projectId, this.regions[0], {
        ...this.archiveModel,
        ownerId: this.getUserOwnerId(),
      })
      .then(() => {
        this.trackAddContainerPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
        return this.goToColdArchiveContainers(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_add_action_create_archive_create_request_success',
            {
              containerName: this.archiveModel.name,
              userName: this.getUserName(),
            },
          ),
        );
      })
      .catch((err) => {
        this.trackAddContainerPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
        this.cucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_add_action_create_archive_create_request_failed',
            {
              containerName: this.archiveModel.name,
              message: err.data?.message || err?.message || err.data,
            },
          ),
          COLD_ARCHIVE_STATES.CONTAINER_ADD,
        );
      })
      .finally(() => {
        this.isArchiveCreationInProgress = false;
      });
  }

  onArchiveSubmit() {
    this.atInternet.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}::${COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM}`,
      type: 'action',
    });
    return this.createArchive();
  }
}
