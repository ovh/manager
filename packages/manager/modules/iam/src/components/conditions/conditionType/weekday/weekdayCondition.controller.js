import { CONDITION_TYPES } from '../conditionType.constants';
import ElementUiService from '../elementUi.service';

const weekdayKeyTemplate = `date({{timezone}}).${CONDITION_TYPES.WEEKDAY}`;

export default class IAMConditionWeekdayController {
  /* @ngInject */
  constructor($element, iamConditionWeekdayService) {
    this.$element = $element;
    this.iamConditionWeekdayService = iamConditionWeekdayService;
  }

  $onInit() {
    this.weekdays = this.iamConditionWeekdayService.getWeekdays();
    this.initForm();
  }

  initForm() {
    if (this.condition?.value) {
      this.weekday = this.condition.value
        .split(',')
        .map((day) => this.weekdays.find(({ value }) => value === day));
    }
  }

  updateConditionValues() {
    const fullKey = `${weekdayKeyTemplate.replace(
      '{{timezone}}',
      this.timezone?.timeZone,
    )}.${this.criterion?.value}`;
    this.condition.values = {
      [fullKey]: this.weekday.map(({ value }) => value).join(','),
    };
    this.condition.hasValue = !!this.condition.values[fullKey];
  }

  $onChanges({ criterion }) {
    if (criterion && this.weekday) {
      this.updateConditionValues();
    }
  }

  scrollSelectIntoView() {
    ElementUiService.scrollOuiSelectIntoView(this.$element);
  }
}
