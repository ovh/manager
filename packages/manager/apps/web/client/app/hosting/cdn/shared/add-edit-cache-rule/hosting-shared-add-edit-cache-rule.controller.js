import find from 'lodash/find';
import set from 'lodash/set';

import {
  SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
  SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR,
  SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE,
} from '../hosting-cdn-shared-settings.constants';

import {
  RESOURCE_REGEX,
  RESOURCE_TYPE_EXTENSION,
  RESOURCE_TYPES_PLACEHOLDER,
} from './hosting-shared-add-edit-cache-rule.constants';

export default class {
  /* @ngInject */
  constructor($translate, HostingCdnSharedService) {
    this.$translate = $translate;
    this.HostingCdnSharedService = HostingCdnSharedService;
    this.RESOURCE_REGEX = RESOURCE_REGEX;
    this.RESOURCE_TYPE_EXTENSION = RESOURCE_TYPE_EXTENSION;
    this.RESOURCE_TYPES_PLACEHOLDER = RESOURCE_TYPES_PLACEHOLDER;

    this.ruleModel = {
      name: null,
      pattern: null,
      ttl: {
        value: null,
        selected: null,
        units: [
          {
            unit: this.$translate.instant(
              'hosting_cdn_shared_modal_add_rule_field_time_to_live_unit_minutes',
            ),
            factor: SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE,
          },
          {
            unit: this.$translate.instant(
              'hosting_cdn_shared_modal_add_rule_field_time_to_live_unit_hours',
            ),
            factor: SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR,
          },
          {
            unit: this.$translate.instant(
              'hosting_cdn_shared_modal_add_rule_field_time_to_live_unit_days',
            ),
            factor: SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
          },
        ],
      },
      priority: {
        min: 0,
        max: null,
        value: null,
        initialValue: null,
      },
    };
  }

  $onInit() {
    if (!this.rules) {
      this.goBack();
    } else if (!this.rule) {
      this.initCreateRuleModel();
    } else {
      this.initUpdateRuleModel();
    }
  }

  initCreateRuleModel() {
    this.ruleModel.priority.min = 0;
    this.ruleModel.priority.max = this.priority.max;
    this.ruleModel.priority.value = this.priority.value;
    this.ruleModel.patternType = this.RESOURCE_TYPE_EXTENSION;
    set(this.ruleModel, 'ttl.selected', this.ruleModel.ttl.units[0]);
  }

  initUpdateRuleModel() {
    this.ruleModel.name = this.rule.name;
    this.ruleModel.pattern = this.rule.pattern;
    this.ruleModel.patternType = this.rule.config.patternType;
    this.ruleModel.ttl.selected = this.getSelectedTimeUnit(
      this.rule.config.ttl,
    );
    this.ruleModel.ttl.value =
      this.rule.config.ttl / this.ruleModel.ttl.selected.factor;
    this.ruleModel.priority.min = 0;
    this.ruleModel.priority.max = this.priority.max;
    this.ruleModel.priority.value = this.rule.config.priority;
  }

  getSelectedTimeUnit(ttl) {
    if (ttl % SHARED_CDN_SETTINGS_RULE_FACTOR_DAY === 0) {
      return find(this.ruleModel.ttl.units, {
        factor: SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
      });
    }
    if (ttl % SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR === 0) {
      return find(this.ruleModel.ttl.units, {
        factor: SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR,
      });
    }
    return find(this.ruleModel.ttl.units, {
      factor: SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE,
    });
  }

  createRule() {
    const { name, pattern, ttl, priority, patternType } = this.ruleModel;
    return {
      type: this.cdnOptionTypeEnum.CACHE_RULE,
      name,
      pattern,
      enabled: true,
      config: {
        ttl: ttl.value * ttl.selected.factor,
        priority: priority.value,
        patternType,
      },
    };
  }

  updateRule(rule) {
    const { name, pattern, ttl, priority, patternType } = this.ruleModel;
    set(rule, 'name', name);
    set(rule, 'pattern', pattern);
    set(rule, 'config.ttl', ttl.value * ttl.selected.factor);
    set(rule, 'config.priority', priority.value);
    set(rule, 'config.patternType', patternType);
    return rule;
  }

  validateRule() {
    if (this.addCacheRuleForm.$valid) {
      if (!this.rule) {
        this.trackClick(`create-rule::${this.ruleModel.patternType}::confirm`);
        this.callbacks.success(this.createRule());
      } else {
        this.callbacks.success(this.updateRule(this.rule));
      }
      this.goBack();
    }
  }

  leaveModal() {
    this.callbacks.cancel();
    this.goBack();
  }

  isValidRuleName({ name }) {
    this.addCacheRuleForm.rule_name.$setValidity(
      'duplicateRuleName',
      find(this.rules, { name }) === undefined,
    );
  }

  isValidRulePattern({ pattern }) {
    this.addCacheRuleForm.rule_pattern.$setValidity(
      'duplicateRulePattern',
      find(this.rules, { pattern }) === undefined,
    );
  }
}
