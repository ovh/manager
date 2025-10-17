import { CRITERIA } from '../../operator/operator.constants';
import { CONDITION_TYPES } from '../conditionType.constants';

const ipKeyTemplate = `request.${CONDITION_TYPES.IP}`;

export default class IAMConditionIPController {
  $onInit() {
    this.initForm();
    this.helperText = 'iam_create_condition_ip_criteria_in_helper';
  }

  initForm() {
    this.ipValue = this.condition?.value;
  }

  updateConditionValues() {
    const fullKey = `${ipKeyTemplate}.${this.criterion?.value}`;
    this.condition.values = {
      [fullKey]: this.ipValue,
    };
    this.condition.hasValue = !!this.condition.values[fullKey];
  }

  updateHelperText() {
    const isIpRange = this.criterion.value === CRITERIA.IN_RANGE;
    this.helperText = isIpRange
      ? 'iam_create_condition_ip_criteria_in_range_helper'
      : 'iam_create_condition_ip_criteria_in_helper';
  }

  $onChanges({ criterion }) {
    if (criterion) {
      this.updateConditionValues();
      this.updateHelperText();
    }
  }
}
