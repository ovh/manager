import get from 'lodash/get';
import startCase from 'lodash/startCase';

export default class PlanMigrationCtrl {
  /* @ngInject */
  constructor($translate, VpsMigrationService) {
    this.$translate = $translate;
    this.VpsMigrationService = VpsMigrationService;
  }

  $onInit() {
    this.setServerIndex(0);
    this.initCalender();
    this.savingSchedule = false;
  }

  initCalender() {
    this.todaysDate = new Date();
    this.dateOptions = {
      enable: [
        {
          from: `${this.todaysDate.getFullYear()}-${this.todaysDate.getMonth()}-${this.todaysDate.getDay()}`,
          to: this.server.migration.notAfter,
        },
      ],
      inline: true,
    };
    const minTime = `${this.todaysDate.getHours()}:${this.todaysDate.getMinutes()}`;
    this.timeOptions = {
      noCalendar: true,
      enableTime: true,
      dateFormat: 'H:i',
      time_24hr: true,
      minTime,
      defaultDate: minTime,
    };
  }

  setServerIndex(serverIndex) {
    this.serverIndex = serverIndex;
    this.server = this.servers[serverIndex];
  }

  formatOption(option) {
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
