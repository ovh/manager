import { CONDITION_TYPES } from '../conditionType.constants';

const tagKeyTemplate = `resource.${CONDITION_TYPES.TAG}({{key}})`;

export default class IAMConditionTagController {
  $onInit() {
    this.initForm();
  }

  initForm() {
    this.tagValue = this.condition?.value;
    this.tagKey = this.condition?.bracketValue;
  }

  updateConditionValues() {
    const fullKey = `${tagKeyTemplate.replace('{{key}}', this.tagKey)}.${
      this.criterion?.value
    }`;
    this.condition.values = {
      [fullKey]: this.tagValue,
    };
  }

  $onChanges({ criterion }) {
    if (criterion) {
      this.updateConditionValues();
    }
  }
}
