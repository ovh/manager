import get from 'lodash/get';

export default class RegenerateServiceKeyCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.isLoading = false;
  }

  regenerateServiceKey() {
    this.isLoading = true;
    return this.cloudConnectService
      .regenerateServiceKey(this.cloudConnect.id, this.serviceKeyId)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'cloud_connect_service_key_regenerate_success',
          ),
          'success',
          true,
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'cloud_connect_service_key_regenerate_error',
            {
              message: get(error, 'data.message', error.message),
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
