import { MESSAGES_CONTAINER_NAME } from '../edit.constant';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.isLoading = false;
  }

  cancel() {
    this.trackClick(
      'PublicCloud::pci::projects::project::edit::remove::cancel',
    );
    this.goBack();
  }

  remove() {
    this.isLoading = true;
    this.trackClick(
      'PublicCloud::pci::projects::project::edit::remove::confirm',
    );

    const promises = [this.delete()];

    if (
      this.defaultProject &&
      this.defaultProject.projectId === this.serviceName
    ) {
      promises.push(this.unFavProject());
    }

    return Promise.all(promises)
      .then(() => {
        this.trackPage(
          'PublicCloud::pci::projects::project::edit::remove-success',
        );
        return this.CucCloudMessage.success(
          this.$translate.instant('pci_projects_project_edit_remove_success'),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .catch(({ data }) => {
        this.trackPage(
          'PublicCloud::pci::projects::project::edit::remove-error',
        );
        return this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_edit_remove_error', {
            error: data.message,
          }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .finally(() => this.goBack());
  }
}
