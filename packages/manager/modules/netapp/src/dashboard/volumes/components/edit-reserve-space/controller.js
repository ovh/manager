import { BOUNDARIES } from './constant';

export default class VolumeEditReserveSpaceCtrl {
  /* @ngInject */
  constructor($translate, EditReserveSpaceService) {
    this.$translate = $translate;
    this.EditReserveSpaceService = EditReserveSpaceService;
  }

  $onInit() {
    this.isLoading = true;
    this.errorMessage = null;
    this.model = {
      percent: BOUNDARIES.MIN_SPACE_PERCENT,
    };

    this.boundaries = BOUNDARIES;
    this.EditReserveSpaceService.getSnapshotReserveSpace(
      this.storage.id,
      this.volume,
    ).then((data) => {
      this.model.percent = data.percent;
      this.isLoading = false;
    });
  }

  cancel() {
    this.goBack();
  }

  modifySnapshotReserveSpace() {
    this.EditReserveSpaceService.modifySnapshotReserveSpace(
      this.storage.id,
      this.volume,
      this.model.percent,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant('netapp_volumes_edit_reserve_space_success', {
            volumeName: this.volume.name || this.volume.id,
          }),
        );
      })
      .catch((error) => {
        this.errorMessage = this.$translate.instant(
          'netapp_volumes_edit_reserve_space_error',
          {
            message: error?.data?.message || error.message,
            requestId: error.headers('X-Ovh-Queryid'),
          },
        );
      });
  }
}
