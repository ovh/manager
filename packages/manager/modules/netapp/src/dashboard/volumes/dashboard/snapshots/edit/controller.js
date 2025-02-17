import { PATTERN } from './constants';
import {
  SNAPSHOT_TRACKING_PREFIX,
  SNAPSHOT_LISTING_TRACKING_CONTEXT,
} from '../constants';

export default class NetAppVolumesDashboardSnapshotsEditController {
  /* @ngInject */
  constructor($http, $translate, atInternet) {
    this.$http = $http;
    this.$translate = $translate;
    this.PATTERN = PATTERN;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.isLoading = false;
    const { id, name, description } = this.snapshot;
    this.id = id;
    this.name = name;
    this.description = description;
    this.atInternet.trackPage({
      name: `${SNAPSHOT_TRACKING_PREFIX}netapp::pop-up::edit::snapshot`,
      ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
    });
  }

  editSnapshot() {
    this.isLoading = true;
    this.trackClick('edit_snapshot::confirm');
    return this.$http
      .put(
        `/storage/netapp/${this.serviceName}/share/${this.volumeId}/snapshot/${this.id}`,
        {
          name: this.name,
          description: this.description,
        },
      )
      .then(() =>
        this.goToSnapshots(
          this.$translate.instant('netapp_volumes_snapshots_edit_success'),
        ),
      )
      .catch((error) =>
        this.goToSnapshots(
          this.$translate.instant('netapp_volumes_snapshots_edit_error', {
            message: error.data?.message,
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  goBack() {
    this.trackClick('edit_snapshot::cancel');
    return this.goToSnapshots();
  }
}
