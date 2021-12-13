import get from 'lodash/get';

export default class PciAppAppStopAddController {
  /* @ngInject */
  constructor($translate, AppService) {
    this.$translate = $translate;
    this.AppService = AppService;
  }

  $onInit() {
    this.isLoading = false;
  }

  onStopAppConfirmClick() {
    this.trackApps('dashboard::stop_app_confirm');

    this.isLoading = true;
    return this.AppService.stopApp(this.projectId, this.app.id)
      .then(() => {
        return this.goToApps(
          this.$translate.instant(
            'pci_apps_general_information_info_stop_app_action_stop_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'pci_apps_general_information_info_stop_app_action_stop_fail',
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

  onStopAppCancelClick() {
    this.trackApps('dashboard::stop_app_cancel');
    return this.goBack();
  }
}
