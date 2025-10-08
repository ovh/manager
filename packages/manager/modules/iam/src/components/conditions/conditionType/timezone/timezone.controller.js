import { TIMEZONES } from './timezone.constants';
import ElementUiService from '../elementUi.service';

export default class IAMConditionTimezoneController {
  /* @ngInject */
  constructor($element) {
    this.$element = $element;
    this.timezones = TIMEZONES;
  }

  $onInit() {
    this.initTimezone();
  }

  initTimezone() {
    if (this.defaultTimezone) {
      this.timezone = TIMEZONES.find(
        ({ timeZone }) => timeZone === this.defaultTimezone,
      );
    } else {
      // Get the UTC offset in minutes
      const utcOffsetInMinutes = new Date().getTimezoneOffset();

      // Convert the offset to hours and format it
      const utcOffsetHours = -utcOffsetInMinutes / 60;
      const offset = `UTC${utcOffsetHours >= 0 ? '+' : ''}${utcOffsetHours}`;
      this.timezone = TIMEZONES.find(({ utcOffset }) => utcOffset === offset);
    }
  }

  scrollSelectIntoView() {
    ElementUiService.scrollOuiSelectIntoView(this.$element);
  }
}
