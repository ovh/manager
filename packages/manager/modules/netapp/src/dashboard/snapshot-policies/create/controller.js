import moment from 'moment';
import { capitalize, range } from 'lodash-es';
import { detectUserLocale } from '@ovh-ux/manager-config';

const MONTHS = range(1, 13);
const WEEKDAYS = range(1, 8);

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

    this.resetNewRule();
    this.buildListItems();
  }

  buildListItems() {
    this.months = MONTHS.map((month) => ({
      id: month,
      label: capitalize(
        moment()
          .month(month - 1)
          .format('MMMM'),
      ),
      value: month,
    }));
    this.weekdays = WEEKDAYS.map((weekday) => ({
      id: weekday,
      label: capitalize(
        moment()
          .weekday(weekday - 1)
          .format('dddd'),
      ),
      value: weekday % 7, // API values has 0 for Sunday
    }));
  }

  addSnapshotPolicyRule() {
    this.newRule = {
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
  }

  onMonthsSelect(items) {
    this.newRule.schedule.months = items.map(({ value }) => value);
  }

  onWeekdaysSelect(items) {
    this.newRule.schedule.weekdays = items.map(({ value }) => value);
  }

  validateSnapshotPolicyRule() {
    this.newSnapshotPolicy.rules = [
      ...this.newSnapshotPolicy.rules,
      this.newRule,
    ];
    this.resetNewRule();
  }

  isNewRuleValid() {
    return (
      this.newRule.prefix != null &&
      this.newRule.prefix !== '' &&
      this.newRule.schedule.minutes.length > 0
    );
  }

  addArrayValuesTo(property) {
    const propertyModel = this[property];

    if (propertyModel) {
      const valuesToSet = propertyModel.match(/\d+/g);
      if (valuesToSet) {
        this.newRule.schedule[property] = valuesToSet.map((value) =>
          parseInt(value, 10),
        );
      }
    }
  }

  resetNewRule() {
    this.newRule = null;
    this.minutes = null;
    this.hours = null;
    this.days = null;
    this.buildListItems();
  }

  isRulePrefixAllowed() {
    return !this.newSnapshotPolicy.rules.find(
      (rule) => rule.prefix === this.newRule.prefix,
    );
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
}
