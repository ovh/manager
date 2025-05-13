import { capitalize } from 'lodash-es';
import { detectUserLocale } from '@ovh-ux/manager-config';
import moment from 'moment';

export default class SnapshotPoliciesController {
  /* @ngInject */
  constructor($attrs) {
    this.$attrs = $attrs;
    moment.locale(detectUserLocale());
  }

  $onInit() {
    this.isSelectable = this.$attrs.selected !== undefined;
    this.hasDeleteFunction = typeof this.onDelete === 'function';
  }

  static getFormattedHour(hour) {
    return Number.isInteger(hour) != null
      ? moment()
          .hour(hour)
          .minute(0)
          .format('LT')
      : hour;
  }

  static getFormattedMonth(month) {
    return Number.isInteger(month)
      ? capitalize(
          moment()
            .month(month - 1)
            .format('MMMM'),
        )
      : month;
  }

  static getFormattedWeekday(weekday) {
    return Number.isInteger(weekday)
      ? capitalize(
          moment()
            .weekday(weekday - 1)
            .format('dddd'),
        )
      : undefined;
  }

  onDeleteClick(snapshotPolicy) {
    this.isDeleting = true;
    return this.onDelete({ snapshotPolicy }).finally(() => {
      this.isDeleting = false;
    });
  }
}
