import {
  ARCHIVE_MESSAGES_ID,
  ARCHIVE_USER_NAMESPACES,
  ARCHIVE_USER_ROLE,
  ARCHIVE_USER_STATUS,
} from './constants';
import { COLD_ARCHIVE_LINKED_MODES } from '../../../add.constants';
import { COLD_ARCHIVE_TRACKING } from '../../../../cold-archives.constants';

export default class ColdArchiveLinkUserArchiveController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciStoragesColdArchiveService,
    PciStoragesObjectStorageService,
    atInternet,
    $q,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
    this.PciStoragesObjectStorageService = PciStoragesObjectStorageService;
    this.atInternet = atInternet;
    this.$q = $q;

    this.USER_SUCCESS_BANNER =
      COLD_ARCHIVE_TRACKING.ADD_USER.USER_SUCCESS_BANNER;
  }

  $onInit() {
    this.messageContainer = ARCHIVE_MESSAGES_ID;

    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}::${hit}`,
      type: 'action',
    });
  }

  trackPage(hit) {
    this.atInternet.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}::${hit}`,
      type: 'page',
    });
  }

  initUsersCredentialsList() {
    this.userModel.linkedMode.isInProgress = true;
    this.pciStoragesColdArchiveService
      .getAllS3Users(this.projectId)
      .then((users) =>
        this.pciStoragesColdArchiveService.mapUsersToCredentials(
          this.projectId,
          users,
        ),
      )
      .then((usersWithCredentials) => {
        this.usersCredentials = usersWithCredentials.map((user) => {
          const updatedUser = user;
          updatedUser.s3Credentials = user.s3Credentials;
          updatedUser.credentialTrad = this.getCredentialTranslation(user);
          updatedUser.userNameDescriptionKey = user.description
            ? `${user.username} - ${user.description}`
            : user.username;
          return updatedUser;
        });
        this.users = this.usersCredentials;
      })
      .catch(() => [])
      .finally(() => {
        this.userModel.linkedMode.isInProgress = false;
      });
  }

  getCredentialTranslation(user) {
    return this.$translate.instant(
      user.s3Credentials
        ? 'pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_select_list_has_credential'
        : 'pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_select_list_has_no_credential',
    );
  }

  isLinkedMode() {
    return (
      this.userModel.createOrLinkedMode === COLD_ARCHIVE_LINKED_MODES.LINKED
    );
  }

  isCreateMode() {
    return (
      this.userModel.createOrLinkedMode === COLD_ARCHIVE_LINKED_MODES.CREATE
    );
  }

  isUsersListSelectable() {
    return this.users.length && !this.userModel.linkedMode.credential;
  }

  canGenerateS3CredentialModeCreate() {
    const { isInProgress, credential, description } = this.userModel.createMode;
    return !isInProgress && !credential && description;
  }

  canGenerateS3CredentialModeLinked() {
    const { isInProgress, credential, selected } = this.userModel.linkedMode;
    return !isInProgress && !credential && selected;
  }

  reset() {
    this.userModel.createOrLinkedMode = null;
  }

  createUser(description) {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.ASSOCIATE_USER}::${COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM}`,
    );
    return this.pciStoragesColdArchiveService
      .createUser(this.projectId, description, ARCHIVE_USER_ROLE)
      .then((user) => {
        return this.pciStoragesColdArchiveService.pollUserStatus(
          this.projectId,
          user.id,
          ARCHIVE_USER_STATUS.OK,
          ARCHIVE_USER_NAMESPACES.CREATE_USER,
        );
      })
      .then((user) => {
        this.userModel.createMode.user = user;
        this.trackPage(
          `${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.ASSOCIATE_USER}_${COLD_ARCHIVE_TRACKING.STATUS.SUCCESS}`,
        );
        return user;
      })
      .catch(() => {
        this.trackPage(
          `${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.ASSOCIATE_USER}_${COLD_ARCHIVE_TRACKING.STATUS.ERROR}`,
        );
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_fail_message',
          ),
          ARCHIVE_MESSAGES_ID,
        );
      });
  }

  generateUserS3Credentials(user) {
    return this.pciStoragesColdArchiveService
      .generateS3Credentials(this.projectId, user.id)
      .catch(() => {
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_add_step_link_user_archive_request_fail',
          ),
          ARCHIVE_MESSAGES_ID,
        );
      });
  }

  onLinkedModeClicked() {
    this.trackClick(COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.EXISTING_USER);
    this.userModel.createOrLinkedMode = COLD_ARCHIVE_LINKED_MODES.LINKED;
    this.initUsersCredentialsList();
  }

  onCreateModeClicked() {
    this.trackClick(COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.NEW_USER);
    this.userModel.createOrLinkedMode = COLD_ARCHIVE_LINKED_MODES.CREATE;
  }

  onCancelCreateUserClicked() {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.NEW_USER}::${COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL}`,
    );
    this.reset();
    this.userModel.createMode.user = null;
    this.userModel.createMode.credential = null;
    this.userModel.createMode.description = '';

    this.CucCloudMessage.flushMessages(ARCHIVE_MESSAGES_ID);
  }

  onCreateUserClicked(description, $event) {
    if (description && (!$event || $event.keyCode === 13)) {
      let newUser;
      this.trackClick(
        `${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.NEW_USER}::${COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM}`,
      );
      this.userModel.createMode.isInProgress = true;
      return this.createUser(description)
        .then((user) => {
          newUser = user;
          return this.generateUserS3Credentials(user).then((credential) => {
            newUser.s3Credentials = credential;
            this.users.push(newUser);
            this.userModel.createMode.user = newUser;
            this.userModel.createMode.credential = credential;
            this.trackPage(
              `${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.NEW_USER}_${COLD_ARCHIVE_TRACKING.STATUS.SUCCESS}`,
            );
            return credential;
          });
        })
        .catch(() => {
          this.trackPage(
            `${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.NEW_USER}_${COLD_ARCHIVE_TRACKING.STATUS.ERROR}`,
          );
        })
        .finally(() => {
          this.userModel.createMode.isInProgress = false;
        });
    }

    return Promise.resolve();
  }

  onCancelLinkedUserClicked() {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.EXISTING_USER}::${COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL}`,
    );
    this.reset();
    this.userModel.linkedMode.selected = null;
    this.userModel.linkedMode.credential = null;
  }

  onLinkedUserClicked(user) {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.EXISTING_USER}::${COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM}`,
    );

    const Service = this.pciStoragesColdArchiveService;
    const taskPromise = user.s3Credentials?.access
      ? Service.getS3Credentials(this.projectId, user.id).then(
          (credentials) => credentials?.[0],
        )
      : Service.generateS3Credentials(this.projectId, user.id);

    const secretPromise = this.PciStoragesObjectStorageService.getS3Secret(
      this.projectId,
      user.id,
      user.s3Credentials?.access,
    );
    this.userModel.linkedMode.isInProgress = true;
    return this.$q
      .all([taskPromise, secretPromise])
      .then(([credential, secretData]) => {
        this.trackPage(
          `${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.ASSOCIATE_USER}_${COLD_ARCHIVE_TRACKING.STATUS.SUCCESS}`,
        );
        this.userModel.linkedMode.selected.s3Credentials = credential;
        this.userModel.linkedMode.credential = {
          ...credential,
          secret: secretData.secret,
        };
      })
      .catch(() => {
        this.trackPage(
          `${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.ASSOCIATE_USER}_${COLD_ARCHIVE_TRACKING.STATUS.ERROR}`,
        );
      })
      .finally(() => {
        this.userModel.linkedMode.isInProgress = false;
      });
  }

  onUserSelected(user) {
    if (!user.s3Credentials?.access) {
      this.userModel.linkedMode.isInProgress = true;

      this.pciStoragesColdArchiveService
        .generateS3Credentials(this.projectId, user.id)
        .then((credential) => {
          this.usersCredentials.find(
            ({ id }) => id === user.id,
          ).s3Credentials = credential;
        })
        .finally(() => {
          this.userModel.linkedMode.isInProgress = false;
        });
    }
  }

  onClipboardFieldClick({ tracking }) {
    this.trackClick(tracking);
  }
}
