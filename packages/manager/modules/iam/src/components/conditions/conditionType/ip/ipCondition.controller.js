import { CONDITION_TYPES } from '../conditionType.constants';

const ipKeyTemplate = `request.${CONDITION_TYPES.IP}`;

export default class IAMConditionIPController {
  $onInit() {
    this.initForm();
  }

  initForm() {
    this.ipValue = this.condition?.value;
  }

  updateConditionValues() {
    const fullKey = `${ipKeyTemplate}.${this.criterion?.value}`;
    this.condition.values = {
      [fullKey]: this.ipValue,
    };
  }

  $onChanges({ criterion }) {
    if (criterion) {
      this.updateConditionValues();
    }
  }
}
