const hourKeyTemplate = 'date({{timezone}}).Hour';

export default class IAMConditionHourController {
  updateConditionValues() {
    const fullKey = `${hourKeyTemplate.replace(
      '{{timezone}}',
      this.timezone?.timeZone,
    )}.${this.criterion?.value}`;
    this.condition.values = {
      [fullKey]: this.hour,
    };
  }

  $onChanges({ criterion }) {
    if (criterion && this.hour) {
      this.updateConditionValues();
    }
  }
}
