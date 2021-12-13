import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, AppService) {
    this.$translate = $translate;
    this.AppService = AppService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deleteApp() {
    this.isDeleting = true;
    return this.AppService.removeApp(this.projectId, this.appId)
      .then(() =>
        this.goBack(this.$translate.instant('pci_ai_apps_delete_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_ai_apps_delete_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }
}
