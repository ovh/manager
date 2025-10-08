import { CONDITION_TYPES } from '../conditionType.constants';

const nameKeyTemplate = `resource.${CONDITION_TYPES.NAME}`;

export default class IAMConditionNameController {
  $onInit() {
    this.initForm();
  }

  initForm() {
    this.nameValue = this.condition?.value;
  }

  updateConditionValues() {
    const fullKey = `${nameKeyTemplate}.${this.criterion?.value}`;
    this.condition.values = {
      [fullKey]: this.nameValue,
    };
    this.condition.hasValue = !!this.condition.values[fullKey];
  }

  $onChanges({ criterion }) {
    if (criterion) {
      this.updateConditionValues();
    }
  }
}
