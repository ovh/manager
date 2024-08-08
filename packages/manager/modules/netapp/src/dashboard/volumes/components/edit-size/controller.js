import { MIN_SIZE, TRACKING_PREFIX } from './constant';

export default class VolumeCreateCtrl {
  /* @ngInject */
  constructor($translate, EditSizeService) {
    this.$translate = $translate;
    this.EditSizeService = EditSizeService;
  }

  $onInit() {
    this.errorMessage = null;
    this.model = {
      size: this.volume.size,
    };

    this.boundaries = {
      max: this.volume.size + this.remainingQuota,
      min: MIN_SIZE,
    };
  }

  cancel() {
    this.trackClick(`${TRACKING_PREFIX}::cancel`);
    this.goBack();
  }

  modifySize() {
    this.trackClick(`${TRACKING_PREFIX}::confirm`);
    this.EditSizeService.modifySize(
      this.storage.id,
      this.volume,
      this.model.size,
    )
      .then(() => {
        this.trackClick(`${TRACKING_PREFIX}-succes`);
        this.goBack(
          this.$translate.instant('netapp_volumes_edit_size_success', {
            volumeName: this.volume.name || this.volume.id,
          }),
        );
      })
      .catch((error) => {
        this.trackClick(`${TRACKING_PREFIX}-error`);
        this.errorMessage = this.$translate.instant(
          'netapp_volumes_edit_size_error',
          {
            message: error?.data?.message || error.message,
            requestId: error.headers('X-Ovh-Queryid'),
          },
        );
      });
  }
}
