import { CONDITION_TYPES } from '../conditionType.constants';

const hourKeyTemplate = `date({{timezone}}).${CONDITION_TYPES.HOUR}`;

export default class IAMConditionHourController {
  $onInit() {
    this.initForm();
  }

  initForm() {
    this.hour = this.condition?.value;
  }

  updateConditionValues() {
    const fullKey = `${hourKeyTemplate.replace(
      '{{timezone}}',
      this.timezone?.timeZone,
    )}.${this.criterion?.value}`;
    this.condition.values = {
      [fullKey]: this.hour,
    };
    this.condition.hasValue = !!this.condition.values[fullKey];
  }

  $onChanges({ criterion }) {
    if (criterion && this.hour) {
      this.updateConditionValues();
    }
  }
}
