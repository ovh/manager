import { CONDITION_TYPES } from '../components/conditions/conditionType/conditionType.constants';
import {
  CRITERIA,
  OPERATORS,
} from '../components/conditions/operator/operator.constants';

export default class IAMConditionsUtils {
  static parseFromAPI(conditions) {
    if (!conditions?.conditions) {
      return [];
    }
    return conditions.conditions.map((condition, index) =>
      IAMConditionsUtils.decodeConditionValues(condition.values, index + 1),
    );
  }

  static decodeConditionValues(values, index) {
    const [entries] = Object.entries(values);
    const [, conditionType, criterion] = entries[0].split('.');
    const type = conditionType.startsWith(CONDITION_TYPES.TAG)
      ? CONDITION_TYPES.TAG
      : conditionType;
    const bracketValue = IAMConditionsUtils.decodeBracketValue(entries[0]);

    return {
      type,
      criterion: criterion ?? CRITERIA.EQ, // empty criterion means "equal"
      conditionType,
      value: entries[1],
      label: entries.join(': '),
      id: `${index}-${Date.now()}`,
      bracketValue,
      values, // raw data to keep
    };
  }

  static parseToAPI(conditions) {
    return {
      operator: OPERATORS.AND,
      conditions: conditions.map(({ values }) => ({
        operator: OPERATORS.MATCH,
        values,
      })),
    };
  }

  static decodeBracketValue(value) {
    const bracketIndex = value?.indexOf('(');
    if (bracketIndex < 0) {
      return '';
    }
    return value.substring(bracketIndex + 1, value.indexOf(')'));
  }
}
