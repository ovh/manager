import {
  COLD_ARCHIVE_ADD_MESSAGES_ID,
  COLD_ARCHIVE_DEFAULT_REGION,
} from './add.constants';

export default class ColdArchiveConfigurationController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, PciStoragesColdArchiveService) {
    this.$translate = $translate;
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

  loadMessages() {
    this.cucCloudMessage.unSubscribe(COLD_ARCHIVE_ADD_MESSAGES_ID);
    this.messageHandler = this.cucCloudMessage.subscribe(
      COLD_ARCHIVE_ADD_MESSAGES_ID,
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
    /*
    TODO: will be completed in another Story

    this.atInternet.trackClick({
      name: `storage_container_create_${
        this.container.offer === 'storage' ? 'standard' : this.container.offer
      }_${this.container.region?.datacenterLocation}_${this.container
        .containerType || 'standard'}`,
      type: 'action',
    }); */

    this.isArchiveCreationInProgress = true;
    return this.pciStoragesColdArchiveService
      .createArchiveContainer(this.projectId, COLD_ARCHIVE_DEFAULT_REGION, {
        ...this.archiveModel,
        ownerId: this.getUserOwnerId(),
      })
      .then(() =>
        this.goToColdArchiveContainers(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_add_action_create_archive_create_request_success',
            {
              containerName: this.archiveModel.name,
              userName: this.getUserName(),
            },
          ),
        ),
      )
      .catch((err) => {
        this.cucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_add_action_create_archive_create_request_failed',
            {
              containerName: this.archiveModel.name,
              message: err.data?.message || err?.message || err.data,
            },
          ),
          COLD_ARCHIVE_ADD_MESSAGES_ID,
        );
      })
      .finally(() => {
        this.isArchiveCreationInProgress = false;
      });
  }

  onArchiveSubmit() {
    return this.createArchive();
  }

  onArchiveCancel() {
    return this.goToColdArchiveContainers();
  }
}
