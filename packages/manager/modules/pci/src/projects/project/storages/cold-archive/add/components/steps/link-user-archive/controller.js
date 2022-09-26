import {
  ARCHIVE_MESSAGES_ID,
  ARCHIVE_USER_NAMESPACES,
  ARCHIVE_USER_ROLE,
  ARCHIVE_USER_STATUS,
} from './constants';
import { COLD_ARCHIVE_LINKED_MODES } from '../../../add.constants';

export default class ColdArchiveLinkUserArchiveController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, PciStoragesUsersService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.pciStoragesUsersService = PciStoragesUsersService;
  }

  $onInit() {
    this.messageContainer = ARCHIVE_MESSAGES_ID;

    this.loadMessages();
    this.initUsersCredentialsList();
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

  initUsersCredentialsList() {
    this.usersCredentials = this.users.map((user) => ({
      ...user,
      credentialTrad: this.getCredentialTranslation(user),
      userNameDescriptionKey: user.description
        ? `${user.username} - ${user.description}`
        : user.username,
    }));
  }

  getCredentialTranslation(user) {
    return this.$translate.instant(
      user.s3Credentials.length > 0
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
    return this.pciStoragesUsersService
      .createUser(this.projectId, {
        description,
        role: ARCHIVE_USER_ROLE,
      })
      .then((user) => {
        return this.pciStoragesUsersService.pollUserStatus(
          this.projectId,
          user.id,
          ARCHIVE_USER_STATUS.OK,
          ARCHIVE_USER_NAMESPACES.CREATE_USER,
        );
      })
      .then((user) => {
        this.userModel.createMode.user = user;

        return user;
      })
      .catch(() => {
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_fail_message',
          ),
          ARCHIVE_MESSAGES_ID,
        );
      });
  }

  generateUserS3Credential(user) {
    return this.pciStoragesUsersService
      .generateS3Credential(this.projectId, user.id)
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
    // this.trackClick(TRACKING_ASSOCIATE_USER);
    this.userModel.createOrLinkedMode = COLD_ARCHIVE_LINKED_MODES.LINKED;
  }

  onCreateModeClicked() {
    // this.trackClick(TRACKING_CREATE_USER);
    this.userModel.createOrLinkedMode = COLD_ARCHIVE_LINKED_MODES.CREATE;
  }

  onCancelCreateUserClicked() {
    // this.trackClick(`${TRACKING_CREATE_USER}-cancel`);
    this.reset();
    this.userModel.createMode.user = null;
    this.userModel.createMode.credential = null;
    this.userModel.createMode.description = '';

    this.CucCloudMessage.flushMessages(ARCHIVE_MESSAGES_ID);
  }

  onCreateUserClicked(description) {
    let newUser;
    // this.trackClick(`${TRACKING_CREATE_USER}-confirm`);
    this.userModel.createMode.isInProgress = true;
    return this.createUser(description)
      .then((user) => {
        newUser = user;
        return this.generateUserS3Credential(user);
      })
      .then((credential) => {
        newUser.s3Credentials = [credential];
        this.userModel.createMode.credential = credential;
        // this.trackPage(`${TRACKING_CREATE_USER}-success`);
        return credential;
      })
      .catch(() => {
        // this.trackPage(`${TRACKING_CREATE_USER}-error`);
      })
      .finally(() => {
        this.userModel.createMode.isInProgress = false;
      });
  }

  onCancelLinkedUserClicked() {
    // this.trackClick(`${TRACKING_ASSOCIATE_USER}-cancel`);
    this.reset();
    this.userModel.linkedMode.selected = null;
    this.userModel.linkedMode.credential = null;
  }

  onLinkedUserClicked() {
    // this.trackClick(`${TRACKING_ASSOCIATE_USER}-confirm`);

    const { selected: user } = this.userModel.linkedMode;
    const defaultCredential = user.s3Credentials[0];
    const functionToCallPromise = defaultCredential
      ? this.pciStoragesUsersService.getS3Credential(
          this.projectId,
          user.id,
          defaultCredential.access,
        )
      : this.pciStoragesUsersService.generateS3Credential(
          this.projectId,
          user.id,
        );
    this.userModel.linkedMode.isInProgress = true;

    return functionToCallPromise
      .then((credential) => {
        // this.trackPage(`${TRACKING_ASSOCIATE_USER}-success`);
        const { s3Credentials } = user;
        user.s3Credentials = s3Credentials || [];
        user.s3Credentials.push(credential);

        this.userModel.linkedMode.credential = credential;
      })
      .catch(() => {
        // this.trackPage(`${TRACKING_ASSOCIATE_USER}-error`);
      })
      .finally(() => {
        this.userModel.linkedMode.isInProgress = false;
      });
  }
}
