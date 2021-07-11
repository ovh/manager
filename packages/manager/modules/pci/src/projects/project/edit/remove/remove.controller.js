import { MESSAGES_CONTAINER_NAME } from '../edit.constant';

export default class {
  /* @ngInject */
  constructor($translate, atInternet, CucCloudMessage) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.isLoading = false;
  }

  remove() {
    this.isLoading = true;

    const promises = [this.delete()];

    if (
      this.defaultProject &&
      this.defaultProject.projectId === this.serviceName
    ) {
      promises.push(this.unFavProject());
    }

    this.atInternet.trackClick({
      name: 'PublicCloud::pci::projects::project::edit::remove::confirm',
      type: 'action',
    });

    return Promise.all(promises)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('pci_projects_project_edit_remove_success'),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_edit_remove_error', {
            error: data.message,
          }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .finally(() => this.goBack());
  }
}
