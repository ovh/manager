import get from 'lodash/get';

export default class RemoveVrackCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.isLoading = false;
  }

  removeVrack() {
    this.cloudConnectService.trackClick(
      'cloud-connect::overview::remove-vrack::confirm',
    );
    this.isLoading = true;
    this.cloudConnectService
      .removeVrack(this.vRackId, this.cloudConnect.id)
      .then(() => {
        this.cloudConnect.vrack = null;
        this.cloudConnect.vrackName = null;
        return this.goBack(
          this.$translate.instant('cloud_connect_vrack_remove_success'),
          'success',
          false,
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_vrack_remove_error', {
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
