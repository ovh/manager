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
  SHARED_CDN_SETTINGS_RULE_CACHE_RULE,
  SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
  SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR,
  SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE,
  SHARED_CDN_SETTINGS_RULE_TYPE_BROTLI,
  SHARED_CDN_SETTINGS_RULE_TYPE_DEVMODE,
} from './hosting-cdn-shared-settings.constants';

export default class CdnSharedSettingsController {
  /* @ngInject */
  constructor($q, $translate, $timeout, Alerter, HostingCdnSharedService) {
    this.$q = $q;
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.Alerter = Alerter;
    this.HostingCdnSharedService = HostingCdnSharedService;
  }

  $onInit() {
    this.loading = { init: false };
    this.model = {
      alwaysOnline: {
        enabled: true,
      },
      http: {
        enabled: true,
      },
      devmode: null,
      brotli: null,
      rules: [],
      maxItems: find(this.availableOptions, {
        type: SHARED_CDN_SETTINGS_RULE_CACHE_RULE,
      }).maxItems,
    };
    this.tasks = { toUpdate: [] };
    this.HostingCdnSharedService.model = this.model;
    this.markFormAsToSave(this.cdnDetails.needRefresh);

    this.model.rules = filter(this.domainOptions, {
      type: SHARED_CDN_SETTINGS_RULE_CACHE_RULE,
    });
    this.model.devmode = find(this.domainOptions, {
      type: SHARED_CDN_SETTINGS_RULE_TYPE_DEVMODE,
    });
    this.model.brotli = find(this.domainOptions, {
      type: SHARED_CDN_SETTINGS_RULE_TYPE_BROTLI,
    });
    this.loading.init = true;
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

  markFormAsToSave(toSave) {
    this.settingsToSave = toSave;
    this.HostingCdnSharedService.settingsToSave = toSave;
  }

  updateSwitchOption(model, modelValue, status) {
    const { type } = model;
    CdnSharedSettingsController.activateDeactivateStatus(status, true);
    this.HostingCdnSharedService.updateCDNDomainOption(
      this.serviceName,
      this.domainName,
      type,
      {
        type,
        enabled: modelValue,
      },
    )
      .then(() => this.markFormAsToSave(true))
      .finally(() =>
        CdnSharedSettingsController.activateDeactivateStatus(status, false),
      );
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
    this.markFormAsToSave(true);
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
        this.markFormAsToSave(true);
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
            this.markFormAsToSave(true);
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
          .then(() => this.markFormAsToSave(true))
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
    const { rules } = this.model;
    this.displayConfirmSettingsModal({
      rules,
      model: this.model,
      success: () => {
        this.HostingCdnSharedService.appliedCdnSettings(
          this.serviceName,
          this.domainName,
        )
          .then(() => {
            this.markFormAsToSave(false);
            return this.goBack().then(() => {
              this.$timeout(() =>
                this.Alerter.success(
                  this.$translate.instant('hosting_cdn_shared_banner_success'),
                  'cdnSharedSettingsSuccess',
                ),
              );
            });
          })
          .catch((err) => {
            this.Alerter.error(
              get(err, 'data.message', ''),
              'cdnSharedSettingsError',
            );
          })
          .finally(() => {
            this.HostingCdnSharedService.isValidCase = false;
          });
      },
      cancel: () => {},
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
}
