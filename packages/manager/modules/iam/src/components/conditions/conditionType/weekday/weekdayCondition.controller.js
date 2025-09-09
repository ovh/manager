const weekdayKeyTemplate = 'date({{timezone}}).WeekDay';

export default class IAMConditionWeekdayController {
  /* @ngInject */
  constructor(iamConditionWeekdayService) {
    this.iamConditionWeekdayService = iamConditionWeekdayService;
  }

  $onInit() {
    this.weekdays = this.iamConditionWeekdayService.getWeekdays();
  }

  updateConditionValues() {
    const fullKey = `${weekdayKeyTemplate.replace(
      '{{timezone}}',
      this.timezone?.timeZone,
    )}.${this.criterion?.value}`;
    this.condition.values = {
      [fullKey]: this.weekday.map(({ value }) => value).join(','),
    };
  }

  $onChanges({ criterion }) {
    if (criterion && this.weekday) {
      this.updateConditionValues();
    }
  }
}
