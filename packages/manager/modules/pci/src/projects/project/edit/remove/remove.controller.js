import { MESSAGES_CONTAINER_NAME } from '../edit.constant';

export default class {
  /* @ngInject */
  constructor($state, $stateParams, $translate, CucCloudMessage, OvhApiCloudProject) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.isLoading = false;
    this.serviceName = $stateParams.projectId;
  }

  remove() {
    this.isLoading = true;

    return this.OvhApiCloudProject
      .v6()
      .delete({
        serviceName: this.serviceName,
      })
      .$promise
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
