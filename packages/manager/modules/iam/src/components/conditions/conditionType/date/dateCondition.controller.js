const dateKeyTemplate = 'date({{timezone}}).Date';

export default class IAMConditionDateController {
  updateConditionValues() {
    const fullKey = `${dateKeyTemplate.replace(
      '{{timezone}}',
      this.timezone?.timeZone,
    )}.${this.criterion?.value}`;
    this.condition.values = {
      [fullKey]: this.dates.replaceAll(' ', ''),
    };
  }

  $onChanges({ criterion }) {
    if (criterion && this.dates) {
      this.updateConditionValues();
    }
  }
}
