import get from 'lodash/get';
import startCase from 'lodash/startCase';

import { AUTO_MIGRATION_CUTOFF_DATE } from '../../vps-migration.constants';

export default class PlanMigrationCtrl {
  /* @ngInject */
  constructor($translate, VpsMigrationService) {
    this.$translate = $translate;
    this.VpsMigrationService = VpsMigrationService;
  }

  $onInit() {
    this.setServerIndex(0);
    this.migrationCutoffDate = moment(
      AUTO_MIGRATION_CUTOFF_DATE,
      'DD-MM-YYYY',
    ).toDate();
    this.initCalender();
    this.savingSchedule = false;
  }

  setMinTime([selectedDate]) {
    if (selectedDate > this.todaysDate) {
      const minTime = new Date();
      minTime.setHours(0);
      minTime.setMinutes(0);
      this.minTime = minTime;
    } else {
      this.minTime = this.todaysDate;
    }
  }

  initCalender() {
    this.todaysDate = new Date();
    this.minTime = this.todaysDate;
    this.dateOptions = {
      enable: [
        {
          from: `${this.todaysDate.getFullYear()}-${
            this.todaysDate.getMonth() + 1
          }-${this.todaysDate.getDate()}`,
          to: `${this.migrationCutoffDate.getFullYear()}-${
            this.migrationCutoffDate.getMonth() + 1
          }-${this.migrationCutoffDate.getDate()}`,
        },
      ],
      inline: true,
    };
    this.timeOptions = {
      noCalendar: true,
      enableTime: true,
      dateFormat: 'H:i',
      time_24hr: true,
      defaultDate: this.todaysDate,
    };
  }

  setServerIndex(serverIndex) {
    this.serverIndex = serverIndex;
    this.server = this.servers[serverIndex];
  }

  static formatOption(option) {
    return startCase(option);
  }

  confirm() {
    const migrationDate = new Date(`${this.scheduleDate}T${this.scheduleTime}`);
    this.savingSchedule = true;
    return this.VpsMigrationService.scheduleMigration(
      this.server.name,
      migrationDate.toISOString(),
    )
      .then(() => {
        if (this.serverIndex < this.servers.length - 1) {
          this.setServerIndex(this.serverIndex + 1);
          this.savingSchedule = false;
        } else {
          this.goBack(
            this.$translate.instant(
              this.servers.length > 1
                ? 'vps_migration_plan_success'
                : 'vps_migration_plan_success_with_date',
              {
                date: this.scheduleDate,
                time: this.scheduleTime,
              },
            ),
          );
        }
      })
      .catch((error) => {
        this.goBack(
          this.$translate.instant('vps_migration_plan_error', {
            message: get(error, 'data.message', 'error.message'),
          }),
          'error',
        );
      });
  }
}
