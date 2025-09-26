import { CONDITION_TYPES } from '../conditionType.constants';

const dateKeyTemplate = `date({{timezone}}).${CONDITION_TYPES.DATE}`;

export default class IAMConditionDateController {
  $onInit() {
    this.initForm();
  }

  initForm() {
    this.dates = this.condition?.value?.replaceAll(',', ', ');
  }

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
