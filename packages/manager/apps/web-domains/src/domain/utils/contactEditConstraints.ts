import {
  TConfigurationRuleConstraint,
  TTranslatedEnum,
  ContactEditFormValues,
} from '@/domain/types/contactEdit';
import { OPERATORS } from '@/domain/constants/contactEdit';

export function getDescendantProp(
  obj: Record<string, unknown>,
  desc: string,
): unknown {
  const arr = desc.split('.');
  let current: unknown = obj;
  for (const key of arr) {
    if (current == null) break;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

export function fieldCurrentValue(
  fieldName: string,
  formValues: ContactEditFormValues,
  contactInformations: Record<string, unknown>,
  ruleLabel: string,
): string {
  const formVal = formValues[fieldName];
  const rawValue = formVal ?? getDescendantProp(contactInformations, ruleLabel);
  if (rawValue === null || rawValue === undefined) {
    return '';
  }
  if (typeof rawValue === 'string') {
    return rawValue;
  }
  if (typeof rawValue === 'object' && 'key' in rawValue) {
    return (rawValue as TTranslatedEnum).key;
  }
  if (rawValue instanceof Date) {
    return rawValue.toISOString().split('T')[0];
  }
  return '';
}

function checkStringValue(
  currentValue: string,
  constraintValue: string,
  haveToInclude: boolean,
  strict: boolean,
): boolean {
  const check = strict
    ? currentValue === constraintValue
    : currentValue.includes(constraintValue);
  return haveToInclude ? check : !check;
}

function checkArrayValue(
  currentValue: string,
  constraintsValues: string[],
  haveToInclude: boolean,
): boolean {
  const check = constraintsValues.includes(currentValue);
  return haveToInclude ? check : !check;
}

export function checkConstraint(
  rules: TConfigurationRuleConstraint,
  formValues: ContactEditFormValues,
  contactInformations: Record<string, unknown>,
  ruleLabel: string,
): boolean {
  // Handle AND conditions inside conditions.fields (e.g. nationalIdentificationNumber, birthDay)
  const fieldsAnd = rules.conditions?.fields?.and;
  if (fieldsAnd) {
    return fieldsAnd.every((fieldCondition) => {
      const pseudoConstraint: TConfigurationRuleConstraint = {
        operator: rules.operator,
        conditions: {
          fields: {
            label: fieldCondition.label,
            constraints: fieldCondition.constraints,
          },
        },
      };
      return checkConstraint(
        pseudoConstraint,
        formValues,
        contactInformations,
        fieldCondition.label,
      );
    });
  }

  const constraints =
    rules.conditions?.fields?.constraints || [rules];
  const fieldLabel = rules.conditions?.fields?.label || ruleLabel;

  const equalRule = constraints.find((c) => c.operator === OPERATORS.EQ);
  const noEqualRule = constraints.find((c) => c.operator === OPERATORS.NE);
  const containsRule = constraints.find(
    (c) => c.operator === OPERATORS.CONTAINS,
  );
  const notContainsRule = constraints.find(
    (c) => c.operator === OPERATORS.NOTCONTAINS,
  );
  const emptyRule = constraints.find((c) => c.operator === OPERATORS.EMPTY);
  const notEmptyRule = constraints.find(
    (c) => c.operator === OPERATORS.NOTEMPTY,
  );

  const currentValue = fieldCurrentValue(
    fieldLabel,
    formValues,
    contactInformations,
    fieldLabel,
  );

  if (equalRule) {
    return equalRule.values
      ? checkArrayValue(currentValue, equalRule.values, true)
      : checkStringValue(currentValue, equalRule.value || '', true, true);
  }

  if (noEqualRule) {
    return noEqualRule.values
      ? checkArrayValue(currentValue, noEqualRule.values, false)
      : checkStringValue(currentValue, noEqualRule.value || '', false, true);
  }

  if (containsRule) {
    return containsRule.values
      ? checkArrayValue(currentValue, containsRule.values, true)
      : checkStringValue(currentValue, containsRule.value || '', true, false);
  }

  if (notContainsRule) {
    return notContainsRule.values
      ? checkArrayValue(currentValue, notContainsRule.values, false)
      : checkStringValue(
        currentValue,
        notContainsRule.value || '',
        false,
        false,
      );
  }

  if (emptyRule) {
    return currentValue === '';
  }

  if (notEmptyRule) {
    return currentValue !== '';
  }

  return true;
}

export function isConstraintSatisfied(
  constraint: TConfigurationRuleConstraint,
  formValues: ContactEditFormValues,
  contactInformations: Record<string, unknown>,
  ruleLabel: string,
): boolean {
  if (constraint.conditions) {
    if (constraint.conditions.and) {
      return constraint.conditions.and.every((r) =>
        checkConstraint(r.fields, formValues, contactInformations, ruleLabel),
      );
    }
    return checkConstraint(
      constraint,
      formValues,
      contactInformations,
      ruleLabel,
    );
  }
  return true;
}

/**
 * Finds the first constraint matching the given operator whose conditions
 * are satisfied. Delegates condition evaluation to isConstraintSatisfied.
 * Also accepts constraints without explicit operator if they have matching conditions
 * (workaround for malformed API responses).
 */
export function findMatchingConstraint(
  constraints: TConfigurationRuleConstraint[],
  operator: string,
  formValues: ContactEditFormValues,
  contactInformations: Record<string, unknown>,
  ruleLabel: string,
): TConfigurationRuleConstraint | undefined {
  return constraints
    .filter((c) => c.operator === operator || (!c.operator && operator === OPERATORS.READONLY && c.conditions))
    .find((constraint) =>
      isConstraintSatisfied(constraint, formValues, contactInformations, ruleLabel),
    );
}

/**
 * Resolves a form value to a plain string.
 * Handles string, TTranslatedEnum ({ key }), Date, null and undefined.
 */
export function resolveFormValue(
  value: ContactEditFormValues[string],
): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && 'key' in value)
    return (value as TTranslatedEnum).key;
  if (value instanceof Date) return value.toISOString().split('T')[0];
  return '';
}
