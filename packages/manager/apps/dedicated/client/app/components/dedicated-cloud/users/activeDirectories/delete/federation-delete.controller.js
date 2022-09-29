export default class ActiveDirectoriesDeleteController {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.dedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.task = null;

    this.loaders = {
      action: false,
      cancelModal: false,
    };
  }

  deleteFederation() {
    this.loaders.action = true;

    return this.dedicatedCloud
      .deleteActiveDirectory(
        this.productId,
        this.activeDirectory.activeDirectoryId,
      )
      .then((data) => {
        this.task = data;
      })
      .catch(({ data: err }) => {
        this.loaders.action = false;
        this.goBack(
          `${this.$translate.instant('dedicatedCloud_USER_AD_delete_error')} ${
            err.message
          }`,
          'danger',
        );
      });
  }

  close() {
    if (this.task.state === 'done') {
      this.loaders.cancelModal = true;
      return this.goBack(false, null, true);
    }
    return this.goBack();
  }
}
