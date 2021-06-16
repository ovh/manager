import get from 'lodash/get';
import { MIGRATE_CONFIRMATION_INPUT_PATTERN } from './migrate-confirm.constants';

export default class {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
    this.MIGRATE_CONFIRMATION_INPUT_PATTERN = MIGRATE_CONFIRMATION_INPUT_PATTERN;
  }

  cancel() {
    this.goBackToMigrate();
  }

  migrateVps() {
    this.loading = true;
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
