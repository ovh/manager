const MESSAGES_CONTAINER_NAME = 'pci.projects.project.sshKeys';

export default class ProjectSshKeysControllerAdd {
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
  }

  goBack() {
    this.$state.go('^');
  }

  add() {
    this.isLoading = true;

    return this.OvhApiCloudProjectSshKey.v6()
      .save(
        {
          serviceName: this.serviceName,
        },
        {
          name: this.name,
          publicKey: this.publicKey,
        },
      )
      .$promise.then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('pci_projects_project_sshKeys_add_success'),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_sshKeys_add_error', {
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
