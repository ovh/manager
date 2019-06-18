import { DEFAULT_PROJECT_KEY, MESSAGES_CONTAINER_NAME } from '../edit.constant';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    OvhApiCloudProject,
    ovhUserPref,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.ovhUserPref = ovhUserPref;
    this.isLoading = false;
    this.serviceName = $stateParams.projectId;
    this.projectId = null;
  }

  $onInit() {
    return this.ovhUserPref
      .getValue(DEFAULT_PROJECT_KEY)
      .then(({ projectId }) => {
        this.projectId = projectId;
      });
  }

  remove() {
    this.isLoading = true;

    const promises = [];

    if (this.projectId === this.serviceName) {
      promises.push(this.ovhUserPref.remove(DEFAULT_PROJECT_KEY));
    }

    promises.push(this.OvhApiCloudProject
      .v6()
      .delete({
        serviceName: this.serviceName,
      })
      .$promise);

    return this.$q.all(promises)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('pci_projects_project_edit_remove_success'),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_edit_remove_error', { error: data.message }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .finally(() => this.goBack());
  }

  goBack() {
    return this.$state.go('^');
  }
}
