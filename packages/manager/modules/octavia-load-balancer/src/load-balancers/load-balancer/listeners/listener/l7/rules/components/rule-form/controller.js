import {
  RULE_TYPES_LIST,
  RULE_TYPES_WITH_KEY,
  COMPARE_TYPES_AVAILABILITY_BY_TYPE,
  VALUE_REGEX_BY_TYPE,
  RULE_TYPES,
  RULE_COMPARE_TYPES,
  KEY_REGEX,
} from './constants';

export default class OctaviaLoadBalancerL7PolicyFormCtrl {
  /* @ngInject */
  constructor($translate, $timeout) {
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.ruleTypes = RULE_TYPES_LIST;
    this.RULE_TYPES = RULE_TYPES;
    this.RULE_TYPES_WITH_KEY = RULE_TYPES_WITH_KEY;
    this.COMPARE_TYPES_AVAILABILITY_BY_TYPE = COMPARE_TYPES_AVAILABILITY_BY_TYPE;
    this.KEY_REGEX = KEY_REGEX;
  }

  $onInit() {
    this.submitButtonLabel =
      this.submitLabel ||
      this.$translate.instant('octavia_load_balancer_create_l7_rule_submit');
  }

  resetCompareType() {
    // If the currently selected compare type is available to the new rule type we keep it
    // else if only one compare type is available we pre select it
    if (
      !this.COMPARE_TYPES_AVAILABILITY_BY_TYPE[this.model.ruleType].find(
        (compareType) => compareType.value === this.model.compareType,
      )
    ) {
      this.model.compareType =
        this.COMPARE_TYPES_AVAILABILITY_BY_TYPE[this.model.ruleType].length ===
        1
          ? this.COMPARE_TYPES_AVAILABILITY_BY_TYPE[this.model.ruleType][0]
              .value
          : undefined;
    }
    // If the selected rule type does not allow to input a key, we empty the key value
    if (!this.RULE_TYPES_WITH_KEY.includes(this.model.ruleType)) {
      this.model.key = undefined;
    }
    // L7 Rule of type sslConnHasCert can only have True value, so we prefill the field and disable it
    if (this.model.ruleType === this.RULE_TYPES.SSL_CONN_HAS_CERT) {
      this.model.value = 'True';
    } else {
      this.refreshValue();
    }
  }

  validateValuePattern(value) {
    // If the user has selected regex as compare type we try to create a regex from the inputted value
    // If it throws an error, it means the inputted value is an invalid regex
    if (this.model.compareType === RULE_COMPARE_TYPES.REGEX) {
      try {
        const regex = new RegExp(value);
        return !!regex;
      } catch (e) {
        return false;
      }
    }
    // If there is no regex for the rule type selected, we validate the value
    if (!VALUE_REGEX_BY_TYPE[this.model.ruleType]) {
      return true;
    }
    return new RegExp(VALUE_REGEX_BY_TYPE[this.model.ruleType]).test(value);
  }

  getValuePatternErrorKey() {
    if (this.model.compareType === RULE_COMPARE_TYPES.REGEX) {
      return 'octavia_load_balancer_create_l7_rule_value_regex_pattern';
    }
    if (this.model.ruleType === RULE_TYPES.SSL_VERIFY_RESULT) {
      return 'octavia_load_balancer_create_l7_rule_value_ssl_verify_result_pattern';
    }
    if (this.model.ruleType === RULE_TYPES.COOKIE) {
      return 'octavia_load_balancer_create_l7_rule_value_cookie_pattern';
    }
    return 'octavia_load_balancer_create_l7_rule_value_default_pattern';
  }

  refreshValue() {
    // We refresh the value to update the error message if validator have changed
    const { value } = this.model;
    this.model.value = undefined;
    this.$timeout(() => {
      this.model.value = value;
    }, 0);
  }
}
