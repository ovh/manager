import { TERMINATION_PATTERN } from './constants';

export default class OvhManagerNetAppVolumeDeleteCtrl {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
    this.PATTERN = TERMINATION_PATTERN;
  }

  deleteVolume() {
    this.isLoading = true;
    return this.$http
      .delete(`/storage/netapp/${this.storage.id}/share/${this.volumeId} `)
      .then(() =>
        this.goBack(this.$translate.instant('netapp_volumes_delete_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('netapp_volumes_delete_error', {
            message: error.data?.message,
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
