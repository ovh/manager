import get from 'lodash/get';

export default class SendServiceKeyCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.isLoading = false;
  }

  sendServiceKey() {
    this.isLoading = true;
    this.cloudConnectService.trackClick(
      'cloud-connect::overview::send-service-key::confirm',
    );
    this.cloudConnectService
      .sendServiceKey(this.cloudConnect.id, this.serviceKeyId, this.email)
      .then(() =>
        this.goBack(
          this.$translate.instant('cloud_connect_service_key_send_success'),
          'success',
          false,
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_service_key_send_error', {
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
