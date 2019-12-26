const MESSAGES_CONTAINER_NAME = 'pci.projects.project.sshKeys';

export default class ProjectSshKeysControllerRemove {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    OvhApiCloudProjectSshKey,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectSshKey = OvhApiCloudProjectSshKey;

    this.serviceName = $stateParams.projectId;
    this.keyId = $stateParams.keyId;
    this.isLoading = false;

    this.$onInit();
  }

  $onInit() {
    this.isLoading = true;

    return this.OvhApiCloudProjectSshKey.v6()
      .get({
        serviceName: this.serviceName,
        keyId: this.keyId,
      })
      .$promise.then((key) => {
        this.key = key;
      })
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_sshKeys_remove_error', {
            error: data.message,
          }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  goBack() {
    this.$state.go('^');
  }

  remove() {
    this.isLoading = true;

    return this.OvhApiCloudProjectSshKey.v6()
      .remove({
        serviceName: this.serviceName,
        keyId: this.keyId,
      })
      .$promise.then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_sshKeys_remove_success',
          ),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_sshKeys_remove_error', {
            error: data.message,
          }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .finally(() => {
        this.goBack();
      });
  }
}
