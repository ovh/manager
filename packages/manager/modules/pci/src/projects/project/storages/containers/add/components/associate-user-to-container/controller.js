import {
  ASSOCIATE_CONTAINER_USER_CONTAINER_MESSAGES,
  CONTAINER_USER_ASSOCIATION_MODES,
  NAMESPACES,
  USER_STATUS,
} from './constant';

export default class CreateLinkedUserController {
  /* @ngInject */
  constructor($q, $translate, CucCloudMessage, PciStoragesUsersService) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesUsersService = PciStoragesUsersService;
  }

  $onInit() {
    this.usersCredentials = this.users.map((user) => ({
      ...user,
      credentialTrad: this.getCredentialTranslation(user),
    }));
    this.loadMessages();
  }

  $onDestroy() {
    this.PciStoragesUsersService.stopPollingUserStatus(NAMESPACES.CREATE_USER);
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      ASSOCIATE_CONTAINER_USER_CONTAINER_MESSAGES,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getCredentialTranslation(user) {
    return user.s3Credentials.length > 0
      ? this.$translate.instant(
          'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_has_credential',
        )
      : '';
  }

  isLinkedMode() {
    return (
      this.userModel.createOrLinkedMode ===
      CONTAINER_USER_ASSOCIATION_MODES.LINKED
    );
  }

  isCreateMode() {
    return (
      this.userModel.createOrLinkedMode ===
      CONTAINER_USER_ASSOCIATION_MODES.CREATE
    );
  }

  canGenerateS3CredentialModeLinked() {
    const { isInProgress, credential, selected } = this.userModel.linkedMode;
    return !isInProgress && !credential && selected;
  }

  canGenerateS3CredentialModeCreate() {
    const { isInProgress, credential, description } = this.userModel.createMode;
    return !isInProgress && !credential && description;
  }

  reset() {
    this.userModel.createOrLinkedMode = null;
  }

  createUser(description) {
    return this.PciStoragesUsersService.createUser(this.projectId, {
      description,
    })
      .then((user) => {
        return this.PciStoragesUsersService.pollUserStatus(
          this.projectId,
          user.id,
          USER_STATUS.OK,
          NAMESPACES.CREATE_USER,
        );
      })
      .then((user) => {
        this.users.push(user);
        this.userModel.createMode.user = user;

        return user;
      })
      .then((user) => {
        return this.generateUserS3Credential(user);
      })
      .then((credential) => {
        this.userModel.createMode.credential = credential;
      })
      .catch(() => {
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_fail_message',
          ),
          ASSOCIATE_CONTAINER_USER_CONTAINER_MESSAGES,
        );
      });
  }

  generateUserS3Credential(user) {
    return this.PciStoragesUsersService.generateS3Credential(
      this.projectId,
      user.id,
    ).catch(() => {
      return this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_containers_add_create_or_linked_user_create_credential_fail_message',
        ),
        ASSOCIATE_CONTAINER_USER_CONTAINER_MESSAGES,
      );
    });
  }

  onLinkedModeClicked() {
    this.userModel.createOrLinkedMode = CONTAINER_USER_ASSOCIATION_MODES.LINKED;
  }

  onCreateModeClicked() {
    this.userModel.createOrLinkedMode = CONTAINER_USER_ASSOCIATION_MODES.CREATE;
  }

  onLinkedUserClicked() {
    const { selected: user } = this.userModel.linkedMode;

    this.userModel.linkedMode.isInProgress = true;
    return this.PciStoragesUsersService.generateS3Credential(
      this.projectId,
      user.id,
    )
      .then((credential) => {
        const { s3Credentials } = user;
        user.s3Credentials = s3Credentials || [];
        user.s3Credentials.push(credential);

        this.userModel.linkedMode.credential = credential;
      })
      .finally(() => {
        this.userModel.linkedMode.isInProgress = false;
      });
  }

  onCancelLinkedUserClicked() {
    this.reset();
    this.userModel.linkedMode.selected = null;
    this.userModel.linkedMode.credential = null;
  }

  onCreateUserClicked(description) {
    this.userModel.createMode.isInProgress = true;
    return this.createUser(description)
      .then((user) => this.generateUserS3Credential(user))
      .finally(() => {
        this.userModel.createMode.isInProgress = false;
      });
  }

  onCancelCreateUserClicked() {
    this.reset();
    this.userModel.createMode.user = null;
    this.userModel.createMode.description = '';
    this.CucCloudMessage.flushMessages(
      ASSOCIATE_CONTAINER_USER_CONTAINER_MESSAGES,
    );
  }
}
