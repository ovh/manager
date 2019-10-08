import find from 'lodash/find';
import head from 'lodash/head';
import map from 'lodash/map';
import range from 'lodash/range';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.adjustWindowEnabled = false;
    this.weekDayMap = map(range(1, 8), number => ({
      number,
      day: this.$translate.instant(`enterprise_cloud_database_service_maintenance_window_day${number}`),
    }));
    this.hourMap = map(range(24), hour => ({
      hour,
      time: ((hour % 12 === 0 ? 12 : hour % 12) + (hour >= 12 ? ' PM' : ' AM')),
    }));
    this.durationMap = map(range(1, 13), hour => ({
      hour,
      time: (hour > 1
        ? `${hour} ${this.$translate.instant('enterprise_cloud_database_service_maintenance_window_adjust_window_hours')}`
        : `${hour} ${this.$translate.instant('enterprise_cloud_database_service_maintenance_window_adjust_window_hour')}`),
    }));
    this.data = {};
    this.resetMaintenanceWindow();
  }

  dataChange() {
    this.onDataChange({ data: this.getMaintenanceWindowFromData() });
  }

  getMaintenanceWindowFromData() {
    return {
      dayOfWeek: this.data.weekdayNumber ? this.data.weekdayNumber.number : undefined,
      duration: this.data.duration ? this.data.duration.hour * 60 : undefined,
      startTime: this.data.hour ? `${`0${this.data.hour.hour}`.slice(-2)}:00:00` : undefined,
    };
  }

  isDefaultMaintenanceWindow() {
    const maintenanceWindow = this.getMaintenanceWindowFromData();
    return maintenanceWindow.dayOfWeek === this.regionInfo.maintenanceDayOfWeek
      && maintenanceWindow.startTime === this.regionInfo.maintenanceStartTime
      && maintenanceWindow.duration === this.regionInfo.maintenanceDuration;
  }

  resetMaintenanceWindow() {
    Object.assign(this.data, {
      weekdayNumber: this.maintenanceWindow
        ? find(this.weekDayMap, { number: this.maintenanceWindow.dayOfWeek })
        : find(this.weekDayMap, { number: this.regionInfo.maintenanceDayOfWeek }),
      hour: this.maintenanceWindow
        ? find(this.hourMap, { hour: parseInt(head(this.maintenanceWindow.startTime.split(':')), 10) })
        : find(this.hourMap, { hour: parseInt(head(this.regionInfo.maintenanceStartTime.split(':')), 10) }),
      duration: this.maintenanceWindow
        ? find(this.durationMap, { hour: (this.maintenanceWindow.duration / 60) })
        : find(this.durationMap, { hour: (this.regionInfo.maintenanceDuration / 60) }),
    });
    this.dataChange();
  }

  toggleAdjustWindow() {
    this.adjustWindowEnabled = !this.adjustWindowEnabled;
  }
}
