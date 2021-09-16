import { TERMINATE_INPUT } from './constants';

export default class {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
    this.TERMINATE_INPUT = TERMINATE_INPUT;
  }

  $onInit() {
    this.trackPage(this.removeStorageHitTracking);
  }

  removeStorage() {
    this.trackClick(`${this.removeStorageHitTracking}::confirm`);
    this.isRemoving = true;

    return this.AnthosTenantsService.removeStorage(
      this.serviceName,
      this.storage.id,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant('anthos_dashboard_remove_storage_success'),
        ),
      )
      .catch((error) => {
        this.goBack(
          this.$translate.instant('anthos_dashboard_remove_storage_error', {
            message: error.data?.message,
          }),
          'error',
        );
      })
      .finally(() => {
        this.isRemoving = false;
      });
  }

  onRemoveStorageCancel() {
    this.trackClick(`${this.removeStorageHitTracking}::cancel`);

    return this.goBack();
  }
}
