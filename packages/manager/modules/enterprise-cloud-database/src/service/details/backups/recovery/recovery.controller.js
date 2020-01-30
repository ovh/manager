import get from 'lodash/get';
import moment from 'moment';

import { STATUS } from '../../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceDetailsBackupsRecoveryCtrl {
  /* @ngInject */
  constructor($state, $translate, enterpriseCloudDatabaseService) {
    this.$state = $state;
    this.$translate = $translate;
    this.service = enterpriseCloudDatabaseService;
  }

  $onInit() {
    this.maxDate = moment().toDate();
    this.minDate = moment(this.minDate).toDate();
    this.isValidDate = true;
  }

  cancel() {
    this.$state.go('^');
  }

  dataChange(defaultPaymentCheck) {
    this.defaultPaymentCheck = defaultPaymentCheck;
  }

  restoreBackup() {
    this.isLoading = true;
    this.timestamp = moment(
      `${this.selectedDate} ${this.selectedTime}`,
    ).format();
    return this.service
      .createRestore(this.clusterId, null, this.timestamp)
      .then((res) =>
        this.goBackToBackups(
          this.$translate.instant(
            'enterprise_cloud_database_backups_recovery_success',
          ),
          STATUS.SUCCESS,
          res.id,
        ),
      )
      .catch((error) =>
        this.goBackToBackups(
          this.$translate.instant(
            'enterprise_cloud_database_backups_recovery_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          STATUS.ERROR,
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  validDate() {
    const selectedDateTime = moment(
      `${this.selectedDate} ${this.selectedTime}`,
    );
    if (
      selectedDateTime.isAfter(this.minDate) &&
      selectedDateTime.isBefore(this.maxDate)
    ) {
      this.isValidDate = true;
    } else {
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
}
