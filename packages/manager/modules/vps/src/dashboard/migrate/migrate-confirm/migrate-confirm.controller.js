import get from 'lodash/get';
import { MIGRATE_CONFIRMATION_INPUT_PATTERN } from './migrate-confirm.constants';

export default class {
  /* @ngInject */
  constructor($http, atInternet, $translate) {
    this.$http = $http;
    this.atInternet = atInternet;
    this.$translate = $translate;
    this.MIGRATE_CONFIRMATION_INPUT_PATTERN = MIGRATE_CONFIRMATION_INPUT_PATTERN;
  }

  cancel() {
    this.atInternet.trackClick({
      name: `${this.migrationConfirmTrackingPrefix}::cancel`,
      type: 'action',
    });
    this.goBackToMigrate();
  }

  migrateVps() {
    this.loading = true;
    this.atInternet.trackClick({
      name: `${this.migrationConfirmTrackingPrefix}::confirm`,
      type: 'action',
    });
    return this.$http
      .post(`/vps/${this.serviceName}/migration2016`)
      .then(() => {
        return this.goBack(
          this.$translate.instant('vps_dashboard_migrate_confirm_success'),
          'success',
          null,
          { reload: true },
        );
      })
      .catch((error) => {
        this.goBackToMigrate(
          `${this.$translate.instant(
            'vps_dashboard_migrate_confirm_error',
          )} ${get(error, 'data.message')}`,
          'error',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
