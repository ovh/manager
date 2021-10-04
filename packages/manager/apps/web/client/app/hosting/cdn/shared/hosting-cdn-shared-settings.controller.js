import set from 'lodash/set';
import get from 'lodash/get';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import maxBy from 'lodash/maxBy';
import concat from 'lodash/concat';
import map from 'lodash/map';
import clone from 'lodash/clone';

import {
  SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
  SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR,
  SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE,
  SHARED_CDN_SETTINGS_RULE_FACTOR_MONTH,
  SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND,
} from './hosting-cdn-shared-settings.constants';

export default class CdnSharedSettingsController {
  /* @ngInject */
  constructor($q, $translate, HostingCdnSharedService) {
    this.$q = $q;
    this.$translate = $translate;
    this.HostingCdnSharedService = HostingCdnSharedService;
  }

  $onInit() {
    this.model = {
      alwaysOnline: {
        enabled: true,
      },
      http: {
        enabled: true,
      },
      rules: filter(this.domainOptions, {
        type: this.cdnOptionTypeEnum.CACHE_RULE,
      }),
      maxItems: find(this.availableOptions, {
        type: this.cdnOptionTypeEnum.CACHE_RULE,
      }).maxItems,
      ...CdnSharedSettingsController.getCdnSettingsOption(
        this.cdnOptionTypeEnum.DEVMODE,
        this.domainOptions,
      ),
      ...CdnSharedSettingsController.getCdnSettingsOption(
        this.cdnOptionTypeEnum.BROTLI,
        this.domainOptions,
      ),
      ...CdnSharedSettingsController.getCdnSettingsOption(
        this.cdnOptionTypeEnum.CORS,
        this.domainOptions,
      ),
      ...CdnSharedSettingsController.getCdnSettingsOption(
        this.cdnOptionTypeEnum.HTTPS_REDIRECT,
        this.domainOptions,
      ),
      ...CdnSharedSettingsController.getCdnSettingsOption(
        this.cdnOptionTypeEnum.HSTS,
        this.domainOptions,
      ),
      ...CdnSharedSettingsController.getCdnSettingsOption(
        this.cdnOptionTypeEnum.MIXED_CONTENT,
        this.domainOptions,
      ),
      ...CdnSharedSettingsController.getCdnSettingsOption(
        this.cdnOptionTypeEnum.WAF,
        this.domainOptions,
      ),
    };

    this.redirections = [
      {
        key: this.$translate.instant(
          'hosting_cdn_shared_option_https_redirect_301',
        ),
        value: 301,
      },
      {
        key: this.$translate.instant(
          'hosting_cdn_shared_option_https_redirect_302',
        ),
        value: 302,
      },
    ];
    this.hstsMaxAgeUnits = [
      {
        key: this.$translate.instant(
          'hosting_cdn_shared_option_hsts_max_age_seconds',
        ),
        value: SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND,
      },
      {
        key: this.$translate.instant(
          'hosting_cdn_shared_option_hsts_max_age_days',
        ),
        value: SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
      },
      {
        key: this.$translate.instant(
          'hosting_cdn_shared_option_hsts_max_age_months',
        ),
        value: SHARED_CDN_SETTINGS_RULE_FACTOR_MONTH,
      },
    ];
    this.hstsMaxAgeValue = this.model.hsts?.config.ttl;
    this.hstsMaxAgeUnit = maxBy(this.hstsMaxAgeUnits, 'value'); // Max age is expressed in months by default
    this.handleHSTSUnit(this.hstsMaxAgeUnit);
    this.redirection = this.redirections.find(
      ({ value }) => value === this.model.https_redirect?.config?.statusCode,
    );
    this.tasks = { toUpdate: [] };
    this.copyModel = angular.copy(this.model);
  }

  static getCdnSettingsOption(optionName, options) {
    return {
      [optionName]: options.find(({ type }) => type === optionName),
    };
  }

  getSwitchBtnStatusText(switchBtn) {
    return this.$translate.instant(
      `hosting_cdn_shared_state_${switchBtn ? 'enable' : 'disabled'}`,
    );
  }

  convertToUnitTime(ttl) {
    if (ttl % SHARED_CDN_SETTINGS_RULE_FACTOR_DAY === 0) {
      return `${ttl /
        SHARED_CDN_SETTINGS_RULE_FACTOR_DAY} ${this.$translate.instant(
        'hosting_cdn_shared_modal_add_rule_field_time_to_live_unit_days',
      )}`;
    }
    if (ttl % SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR === 0) {
      return `${ttl /
        SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR} ${this.$translate.instant(
        'hosting_cdn_shared_modal_add_rule_field_time_to_live_unit_hours',
      )}`;
    }
    return `${ttl /
      SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE} ${this.$translate.instant(
      'hosting_cdn_shared_modal_add_rule_field_time_to_live_unit_minutes',
    )}`;
  }

  getMaxPriority() {
    return (
      get(maxBy(this.model.rules, 'config.priority'), 'config.priority') || 0
    );
  }

  rulePriorityExist(rule) {
    return find(
      this.model.rules,
      (r) => rule !== r && r.config.priority === rule.config.priority,
    );
  }

  setRulesPriority(rule) {
    if (this.rulePriorityExist(rule)) {
      forEach(this.model.rules, (iRule) => {
        const { priority } = iRule.config;
        if (rule !== iRule && priority >= rule.config.priority) {
          set(iRule, 'config.priority', priority + 1);
          this.markRuleAsToUpdate(iRule);
        }
      });
    }
  }

  static activateDeactivateStatus(status, state) {
    set(status, 'inProgress', state);
  }

  createRule(rule) {
    return this.HostingCdnSharedService.addNewOptionToDomain(
      this.serviceName,
      this.domainName,
      rule,
    );
  }

  updateRule(rule, modelValue) {
    const cRule = clone(rule);
    delete cRule.name;
    if (modelValue !== undefined) cRule.enabled = modelValue;
    return this.HostingCdnSharedService.updateCDNDomainOption(
      this.serviceName,
      this.domainName,
      rule.name,
      cRule,
    );
  }

  removeRule(rule, status) {
    CdnSharedSettingsController.activateDeactivateStatus(status, true);
    return this.HostingCdnSharedService.deleteCDNDomainOption(
      this.serviceName,
      this.domainName,
      rule.name,
    )
      .then((res) => {
        const index = this.model.rules.indexOf(rule);
        if (index >= 0) this.model.rules.splice(index, 1);
        return res;
      })
      .finally(() =>
        CdnSharedSettingsController.activateDeactivateStatus(status, false),
      );
  }

  updateSwitchRule(rule, modelValue, status) {
    CdnSharedSettingsController.activateDeactivateStatus(status, true);
    return this.updateRule(rule, modelValue)
      .then((res) => {
        return res;
      })
      .finally(
        CdnSharedSettingsController.activateDeactivateStatus(status, false),
      );
  }

  getRulesTasks(rules) {
    return map(rules, (rule) => {
      const cRule = clone(rule);
      delete cRule.name;
      return this.HostingCdnSharedService.updateCDNDomainOption(
        this.serviceName,
        this.domainName,
        rule.name,
        cRule,
      );
    });
  }

  updateChangedRules(rules, status) {
    CdnSharedSettingsController.activateDeactivateStatus(status, true);
    const tasks = this.getRulesTasks(this.tasks.toUpdate);
    return this.$q.all(tasks);
  }

  markRuleAsToUpdate(rule) {
    this.tasks.toUpdate.push(rule);
  }

  openCreatCacheRuleModal(status) {
    const priority = {
      max: this.getMaxPriority() + 1,
      value: this.getMaxPriority() + 1,
    };
    const callbacks = {
      success: (rule) => {
        this.setRulesPriority(rule);
        this.updateChangedRules(this.tasks.toUpdate, status)
          .then(() => this.createRule(rule))
          .then(() => {
            this.model.rules.push(rule);
          })
          .finally(() => {
            this.tasks.toUpdate = [];
            CdnSharedSettingsController.activateDeactivateStatus(status, false);
          });
      },
      fail: () => {},
      cancel: () => {},
    };
    const params = {
      rule: null,
      rules: this.model.rules,
      priority,
      callbacks,
    };
    this.displayCreateCacheRuleModal(params);
  }

  openUpdateCacheRuleModal(rule, status) {
    const priority = {
      value: rule.config.priority,
    };
    const callbacks = {
      success: (uRule) => {
        this.setRulesPriority(uRule);
        this.updateChangedRules(this.tasks.toUpdate, status)
          .then(() => this.updateRule(uRule))
          .finally(() => {
            this.tasks.toUpdate = [];
            CdnSharedSettingsController.activateDeactivateStatus(status, false);
          });
      },
      fail: () => {},
      cancel: () => {},
    };
    const params = {
      rule,
      rules: this.model.rules,
      priority,
      callbacks,
    };
    this.displayUpdateCacheRuleModal(params);
  }

  openConfirmModal() {
    const { rules, ...model } = this.model;
    this.displayConfirmSettingsModal({
      rules,
      model,
      oldModel: this.copyModel,
    });
    this.trackClick('web::hosting::cdn::configure::apply-configuration');
  }

  static getChangedSwitches(model) {
    const { alwaysOnline, http, devmode, brotli } = model;
    const switchesTasks = [alwaysOnline, http, devmode, brotli];
    return filter(switchesTasks, (s) => s && s.changed);
  }

  static getChangedRules(tasks) {
    const { toAdd, toUpdate, toRemove } = tasks;
    return concat(toAdd, toRemove, toUpdate);
  }

  static hasModelChange(model, copyModel) {
    return !angular.equals(model, copyModel);
  }

  setRedirection(redirection) {
    this.model.https_redirect.config.statusCode = redirection.value;
  }

  setHstsMaxAge() {
    this.model.hsts.config.ttl =
      this.hstsMaxAgeValue * this.hstsMaxAgeUnit.value;
  }

  handleHSTSUnit(unit) {
    this.hstsMaxAgeValue = this.model.hsts.config.ttl / unit.value;
  }

  hasSecurityOptions(config) {
    return [
      this.cdnOptionTypeEnum.CORS,
      this.cdnOptionTypeEnum.HTTPS_REDIRECT,
      this.cdnOptionTypeEnum.HSTS,
      this.cdnOptionTypeEnum.MIXED_CONTENT,
      this.cdnOptionTypeEnum.WAF,
    ].some((key) => config[key]);
  }

  onCancel() {
    if (
      !CdnSharedSettingsController.hasModelChange(this.model, this.copyModel)
    ) {
      return this.goBack();
    }

    return this.displayLeaveSettingsModal(this.model);
  }
}
