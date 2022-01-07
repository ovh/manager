import moment from 'moment';
import { capitalize, cloneDeep, range } from 'lodash-es';
import { detectUserLocale } from '@ovh-ux/manager-config';

const DATE_CONSTANTS = {
  MINUTES: range(0, 60),
  HOURS: range(0, 24),
  DAYS: range(1, 32),
  MONTHS: range(1, 13),
  WEEKDAYS: range(1, 8),
};

export default class OvhManagerNetAppSnapshotPoliciesCreateCtrl {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;

    moment.locale(detectUserLocale());
  }

  $onInit() {
    this.newSnapshotPolicy = {
      rules: [],
    };

    this.buildListItems();
  }

  buildListItems() {
    this.months = DATE_CONSTANTS.MONTHS.map((month) => ({
      id: month,
      label: capitalize(
        moment()
          .month(month - 1)
          .format('MMMM'),
      ),
      value: month,
    }));
    this.weekdays = DATE_CONSTANTS.WEEKDAYS.map((weekday) => ({
      id: weekday,
      label: capitalize(
        moment()
          .weekday(weekday - 1)
          .format('dddd'),
      ),
      value: weekday % 7, // API values has 0 for Sunday
    }));
  }

  editRule(ruleIndex) {
    const ruleToEdit = this.newSnapshotPolicy.rules[ruleIndex];
    this.ruleCopy = cloneDeep(ruleToEdit);
    this.newRule = {
      isInEdition: true,
      ...ruleToEdit,
    };
    this.minutes = this.newRule.schedule.minutes.join(', ');
    this.hours = this.newRule.schedule.hours.join(', ');
    this.days = this.newRule.schedule.days.join(', ');

    this.months = this.months.map((month) => ({
      ...month,
      checked: this.newRule.schedule.months.includes(month.value),
    }));

    this.weekdays = this.weekdays.map((month) => ({
      ...month,
      checked: this.newRule.schedule.weekdays.includes(month.value),
    }));

    this.newSnapshotPolicy.rules.splice(ruleIndex, 1, this.newRule);
  }

  addSnapshotPolicyRule() {
    this.newRule = {
      isInEdition: true,
      prefix: undefined,
      copies: 1,
      schedule: {
        days: [],
        minutes: [],
        hours: [],
        months: [],
        weekdays: [],
      },
    };

    this.newSnapshotPolicy.rules.push(this.newRule);
  }

  onMonthsSelect(items) {
    this.newRule.schedule.months = items.map(({ value }) => value);
  }

  onWeekdaysSelect(items) {
    this.newRule.schedule.weekdays = items.map(({ value }) => value);
  }

  validateSnapshotPolicyRule(ruleIndex) {
    const { isInEdition, ...ruleToValidate } = this.newRule;
    this.newSnapshotPolicy.rules[ruleIndex] = ruleToValidate;
    this.resetNewRule();
  }

  isNewRuleValid() {
    return (
      this.newRule.prefix != null &&
      this.newRule.prefix !== '' &&
      this.newRule.schedule.minutes.length > 0 &&
      !this.snapshotPolicyForm.minutes.$invalid &&
      !this.snapshotPolicyForm.hours.$invalid &&
      !this.snapshotPolicyForm.days.$invalid
    );
  }

  addArrayValuesTo(property) {
    const propertyModel = this[property];

    if (propertyModel) {
      const validInput = OvhManagerNetAppSnapshotPoliciesCreateCtrl.isInputValid(
        propertyModel,
      );
      const areInputsInRange = OvhManagerNetAppSnapshotPoliciesCreateCtrl.checkInputsRange(
        propertyModel,
        DATE_CONSTANTS[property.toUpperCase()],
      );
      this.snapshotPolicyForm[property].$invalid =
        !validInput || !areInputsInRange;
      if (validInput && areInputsInRange) {
        this.newRule.schedule[property] = propertyModel
          .split(',')
          .filter((value) => !Number.isNaN(parseInt(value, 10)))
          .map((value) => parseInt(value, 10));
      }
    } else {
      this.newRule.schedule[property] = [];
    }
  }

  resetNewRule() {
    this.newRule = null;
    this.minutes = null;
    this.hours = null;
    this.days = null;
    this.buildListItems();
  }

  cancelNewRule($rowIndex) {
    if (this.ruleCopy) {
      this.newSnapshotPolicy.rules.splice($rowIndex, 1, this.ruleCopy);
    } else {
      this.newSnapshotPolicy.rules.splice($rowIndex, 1);
    }
    this.resetNewRule();
  }

  isRulePrefixAllowed() {
    return !this.newSnapshotPolicy.rules
      .filter(({ isInEdition }) => !isInEdition)
      .find((rule) => rule.prefix === this.newRule.prefix);
  }

  getValueLabel(valueToGet, listName) {
    const list = this[listName];

    if (listName) {
      const { label } = list.find(({ value }) => value === valueToGet);

      return label;
    }

    return null;
  }

  removeRule(rule) {
    this.newSnapshotPolicy.rules = this.newSnapshotPolicy.rules.filter(
      (r) => r.prefix !== rule.prefix,
    );
  }

  createSnapshotPolicy() {
    this.isCreating = true;
    this.error = null;

    this.trackClick('snapshot-policy::create::confirm');
    return this.$http
      .post(
        `/storage/netapp/${this.serviceName}/snapshotPolicy`,
        this.newSnapshotPolicy,
      )
      .then((newSnapshotPolicy) =>
        this.goBackToSnapshotPolicies(
          this.$translate.instant('netapp_snapshot_policies_create_success', {
            snapshotPolicyName: newSnapshotPolicy.name || newSnapshotPolicy.id,
          }),
        ),
      )
      .catch((error) => {
        this.error = error?.data?.message || error.message;
      })
      .finally(() => {
        this.isCreating = false;
      });
  }

  static checkInputsRange(modelValue, rangeValues) {
    const inputs = modelValue.match(/\d+/g);
    return inputs.every((input) => rangeValues.includes(parseInt(input, 10)));
  }

  static isInputValid(input) {
    return input.match(/^([^\D]?[0-9, ]+)$/g);
  }
}
