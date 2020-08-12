import get from 'lodash/get';

export default class CloudConnectEditDescriptionCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  confirm() {
    this.cloudConnectService.trackClick(
      'cloud-connect::overview::edit-description::confirm',
    );
    this.isLoading = true;
    return this.cloudConnectService
      .saveDescription(this.cloudConnect.id, this.description)
      .then(() => {
        return this.goBack(
          this.$translate.instant('cloud_connect_edit_description_success'),
          'success',
          true,
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_edit_description_error', {
            message: get(error, 'data.message', error.message),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
