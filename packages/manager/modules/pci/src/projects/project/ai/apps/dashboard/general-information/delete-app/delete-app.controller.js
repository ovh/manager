import get from 'lodash/get';

export default class PciAppAppDeleteAddController {
  /* @ngInject */
  constructor($translate, AppService) {
    this.$translate = $translate;
    this.AppService = AppService;
  }

  $onInit() {
    this.isLoading = false;
  }

  onDeleteAppConfirmClick() {
    this.trackApps('dashboard::delete_app_confirm');

    this.isLoading = true;
    return this.AppService.removeApp(this.projectId, this.app.id)
      .then(() => {
        return this.goToApps(
          this.$translate.instant(
            'pci_apps_general_information_info_delete_app_action_delete_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'pci_apps_general_information_info_delete_app_action_delete_fail',
            {
              name: this.app.name,
              message: get(error, 'data.message'),
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onDeleteAppCancelClick() {
    this.trackApps('dashboard::delete_app_cancel');
    return this.goBack();
  }
}
