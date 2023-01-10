import {
  ASSOCIATE_CONTAINER_USER_CONTAINER_MESSAGES,
  CONTAINER_USER_ASSOCIATION_MODES,
  NAMESPACES,
  OBJECT_STORAGE_USER_ROLE,
  TRACKING_ASSOCIATE_USER,
  TRACKING_CREATE_USER,
  TRACKING_PREFIX,
  USER_ROLES,
  USER_STATUS,
} from './constant';

export default class CreateLinkedUserController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    PciStoragesUsersService,
    atInternet,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesUsersService = PciStoragesUsersService;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.setUserCredentialsList();
    this.loadMessages();
  }

  $onDestroy() {
    this.PciStoragesUsersService.stopPollingUserStatus(NAMESPACES.CREATE_USER);
  }

  setUserCredentialsList() {
    this.usersCredentials = this.users
      .filter(({ roles }) => {
        return roles.find(({ name }) =>
          [USER_ROLES.ADMINISTRATOR, USER_ROLES.OBJECTSTORE_OPERATOR].includes(
            name,
          ),
        );
      })
      .map((user) => ({
        ...user,
        credentialTrad: this.getCredentialTranslation(user),
        userNameDescriptionKey: user.description
          ? `${user.username} - ${user.description}`
          : user.username,
      }));
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
    return this.$translate.instant(
      user.s3Credentials.length > 0
        ? 'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_has_credential'
        : 'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_has_not_credential',
    );
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

  isUsersListSelectable() {
    return this.users.length && !this.userModel.linkedMode.credential;
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
      role: OBJECT_STORAGE_USER_ROLE,
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
        this.userModel.createMode.user = user;

        return user;
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
    this.trackClick(TRACKING_ASSOCIATE_USER);
    this.userModel.createOrLinkedMode = CONTAINER_USER_ASSOCIATION_MODES.LINKED;
  }

  onCreateModeClicked() {
    this.trackClick(TRACKING_CREATE_USER);
    this.userModel.createOrLinkedMode = CONTAINER_USER_ASSOCIATION_MODES.CREATE;
  }

  onLinkedUserClicked() {
    this.trackClick(`${TRACKING_ASSOCIATE_USER}-confirm`);

    const service = this.PciStoragesUsersService;
    const { selected: user } = this.userModel.linkedMode;
    const defaultCredential = user.s3Credentials[0];
    const functionToCallPromise = defaultCredential
      ? service.getS3Credential(
          this.projectId,
          user.id,
          defaultCredential.access,
        )
      : service.generateS3Credential(this.projectId, user.id);
    this.userModel.linkedMode.isInProgress = true;

    return functionToCallPromise
      .then((credential) => {
        this.trackPage(`${TRACKING_ASSOCIATE_USER}-success`);
        const { s3Credentials } = user;
        user.s3Credentials = s3Credentials || [];
        user.s3Credentials.push(credential);

        this.userModel.linkedMode.credential = credential;
      })
      .catch(() => {
        this.trackPage(`${TRACKING_ASSOCIATE_USER}-error`);
      })
      .finally(() => {
        this.userModel.linkedMode.isInProgress = false;
      });
  }

  onCancelLinkedUserClicked() {
    this.trackClick(`${TRACKING_ASSOCIATE_USER}-cancel`);
    this.reset();
    this.userModel.linkedMode.selected = null;
    this.userModel.linkedMode.credential = null;
  }

  onCreateUserClicked(description) {
    let newUser;
    this.trackClick(`${TRACKING_CREATE_USER}-confirm`);
    this.userModel.createMode.isInProgress = true;
    return this.createUser(description)
      .then((user) => {
        newUser = user;
        return this.generateUserS3Credential(user);
      })
      .then((credential) => {
        newUser.s3Credentials = [credential];
        this.users.push(newUser);
        this.userModel.createMode.credential = credential;
        this.setUserCredentialsList();
        this.trackPage(`${TRACKING_CREATE_USER}-success`);
        return credential;
      })
      .catch(() => {
        this.trackPage(`${TRACKING_CREATE_USER}-error`);
      })
      .finally(() => {
        this.userModel.createMode.isInProgress = false;
      });
  }

  onCancelCreateUserClicked() {
    this.trackClick(`${TRACKING_CREATE_USER}-cancel`);
    this.reset();
    this.userModel.createMode.user = null;
    this.userModel.createMode.credential = null;
    this.userModel.createMode.description = '';

    this.CucCloudMessage.flushMessages(
      ASSOCIATE_CONTAINER_USER_CONTAINER_MESSAGES,
    );
  }

  trackPage(page) {
    this.atInternet.trackPage({
      name: `${TRACKING_PREFIX}${page}`,
      type: 'navigation',
    });
  }

  trackClick(action) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}${action}`,
      type: 'action',
    });
  }
}
