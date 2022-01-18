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
  SHARED_CDN_OPTIONS,
  SHARED_CDN_RANGE,
  SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
  SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR,
  SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE,
  SHARED_CDN_SETTINGS_RULE_FACTOR_MONTH,
  SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND,
  SHARED_CDN_SETTINGS_RULES_NB_RULES_BY_PAGE,
} from './hosting-cdn-shared-settings.constants';

export default class CdnSharedSettingsController {
  /* @ngInject */
  constructor($filter, $q, $translate, HostingCdnSharedService) {
    this.$filter = $filter;
    this.$q = $q;
    this.$translate = $translate;
    this.HostingCdnSharedService = HostingCdnSharedService;

    this.datagridRulesId = 'rulesDatagrid';
    this.SHARED_CDN_RANGE = SHARED_CDN_RANGE;
    this.SHARED_CDN_SETTINGS_RULES_NB_RULES_BY_PAGE = SHARED_CDN_SETTINGS_RULES_NB_RULES_BY_PAGE;
  }

  $onInit() {
    const mobileRedirectOption = CdnSharedSettingsController.getCdnSettingsOption(
      this.cdnOptionTypeEnum.MOBILE_REDIRECT,
      this.domainOptions,
    );
    this.model = {
      rules: filter(this.domainOptions, {
        type: this.cdnOptionTypeEnum.CACHE_RULE,
      }),
      maxItems: find(this.availableOptions, {
        type: this.cdnOptionTypeEnum.CACHE_RULE,
      }).maxItems,
      /* Use api property to get api option */
      options: {
        perf: {
          always_online: {
            operate: false,
            enabled: true,
            api: null,
          },
          http: {
            operate: false,
            enabled: true,
            api: null,
          },
          brotli: {
            api: CdnSharedSettingsController.getCdnSettingsOption(
              this.cdnOptionTypeEnum.BROTLI,
              this.domainOptions,
            ),
          },
          geo_headers: {
            api: CdnSharedSettingsController.getCdnSettingsOption(
              this.cdnOptionTypeEnum.GEO_HEADERS,
              this.domainOptions,
            ),
          },
          prefetch: {
            api: CdnSharedSettingsController.getCdnSettingsOption(
              this.cdnOptionTypeEnum.PREFETCH,
              this.domainOptions,
            ),
          },
          mobile_redirect: {
            selected:
              SHARED_CDN_OPTIONS.MOBILE_REDIRECT[
                mobileRedirectOption?.config.followUri
                  ? 'KEEP_URL'
                  : 'STILL_URL'
              ],
            redirectOptions: [
              SHARED_CDN_OPTIONS.MOBILE_REDIRECT.STILL_URL,
              SHARED_CDN_OPTIONS.MOBILE_REDIRECT.KEEP_URL,
            ],
            api: mobileRedirectOption,
          },
        },
        cache: {
          devmode: {
            api: CdnSharedSettingsController.getCdnSettingsOption(
              this.cdnOptionTypeEnum.DEVMODE,
              this.domainOptions,
            ),
          },
          querystring: {
            sortOptions: [
              SHARED_CDN_OPTIONS.QUERY_STRING.SORT_PARAMS.SORT,
              SHARED_CDN_OPTIONS.QUERY_STRING.SORT_PARAMS.IGNORED,
            ],
            api: CdnSharedSettingsController.getCdnSettingsOption(
              this.cdnOptionTypeEnum.QUERYSTRING,
              this.domainOptions,
            ),
          },
          prewarm: {
            api: CdnSharedSettingsController.getCdnSettingsOption(
              this.cdnOptionTypeEnum.PREWARM,
              this.domainOptions,
            ),
          },
          advanced_purge: {
            name: 'advanced_purge',
            operate: this.cdnRange === SHARED_CDN_RANGE.ADVANCED,
            enabled: this.cdnRange === SHARED_CDN_RANGE.ADVANCED,
            isDisplayableStatus: false,
            api: null,
          },
        },
        security: {
          cors: {
            api: CdnSharedSettingsController.getCdnSettingsOption(
              this.cdnOptionTypeEnum.CORS,
              this.domainOptions,
            ),
          },
          https_redirect: {
            api: CdnSharedSettingsController.getCdnSettingsOption(
              this.cdnOptionTypeEnum.HTTPS_REDIRECT,
              this.domainOptions,
            ),
          },
          hsts: {
            api: CdnSharedSettingsController.getCdnSettingsOption(
              this.cdnOptionTypeEnum.HSTS,
              this.domainOptions,
            ),
          },
          mixed_content: {
            api: CdnSharedSettingsController.getCdnSettingsOption(
              this.cdnOptionTypeEnum.MIXED_CONTENT,
              this.domainOptions,
            ),
          },
          waf: {
            api: CdnSharedSettingsController.getCdnSettingsOption(
              this.cdnOptionTypeEnum.WAF,
              this.domainOptions,
            ),
          },
        },
      },
      optionTypes: {
        PERF: 'perf',
        CACHE: 'cache',
        SECURITY: 'security',
      },
    };
    this.copyModel = angular.copy(this.model);

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
    this.hstsMaxAgeValue = this.model.options.security.hsts.api?.config.ttl;
    this.hstsMaxAgeUnit = maxBy(this.hstsMaxAgeUnits, 'value'); // Max age is expressed in months by default
    this.handleHSTSUnit(this.hstsMaxAgeUnit);
    this.redirection = this.redirections.find(
      ({ value }) =>
        value ===
        this.model.options.security.https_redirect.api?.config?.statusCode,
    );
    this.tasks = { toUpdate: [] };
  }

  getPrefetchOptionInfoLink() {
    const { LINKS } = SHARED_CDN_OPTIONS.PREFETCH;
    return LINKS[this.user.ovhSubsidiary] || LINKS.DEFAULT;
  }

  static getCdnSettingsOption(optionName, options) {
    return options.find(({ type }) => type === optionName);
  }

  static activateDeactivateStatus(status, state) {
    set(status, 'inProgress', state);
  }

  static getChangedSwitches(model) {
    const { always_online: alwaysOnline, http, devmode, brotli } = model;
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

  static getFormattedHstsNumber(hstsMaxAgeValue) {
    const [number, decimal] = `${hstsMaxAgeValue}`.split('.');
    const { FIXED_NUMBER } = SHARED_CDN_OPTIONS.HSTS;

    if (hstsMaxAgeValue % 1 !== 0) {
      return `${number}.${decimal.substring(0, FIXED_NUMBER)}`;
    }
    return Math.round(hstsMaxAgeValue);
  }

  getOption(type, optionName) {
    return get(this.model?.options, `${type}.${optionName}`, null);
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
    this.trackClick('delete_cdn_rule');

    CdnSharedSettingsController.activateDeactivateStatus(status, true);
    return this.HostingCdnSharedService.deleteCDNDomainOption(
      this.serviceName,
      this.domainName,
      rule.name,
    )
      .then((res) => {
        const ruleIndex = this.model.rules.findIndex(
          ({ name }) => name === rule.name,
        );
        if (ruleIndex >= 0) this.model.rules.splice(ruleIndex, 1);

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

  refreshDatagridRule(rule) {
    const { model } = this;

    model.rules.forEach(({ name }, index) => {
      if (name === rule.name) {
        model.rules[index] = { ...rule };
      }
    });
  }

  openCreateCacheRuleModal(status) {
    const priority = {
      max: this.getMaxPriority() + 1,
      value: this.getMaxPriority() + 1,
    };
    const callbacks = {
      success: (rule) => {
        this.setRulesPriority(rule);
        this.updateChangedRules(this.tasks.toUpdate, status)
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
          .then(() => this.refreshDatagridRule(rule))
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

  setRedirection(redirection) {
    this.model.options.security.https_redirect.api.config.statusCode =
      redirection.value;
  }

  setHstsMaxAge() {
    const { api } = this.model.options.security.hsts;
    const { hstsMaxAgeValue, hstsMaxAgeUnit } = this;
    const [number, decimal] = `${hstsMaxAgeValue}`.split('.');

    if (number && decimal) {
      this.hstsMaxAgeValue = CdnSharedSettingsController.getFormattedHstsNumber(
        hstsMaxAgeValue,
      );
    }

    api.config.ttl = this.hstsMaxAgeValue * hstsMaxAgeUnit.value;
  }

  handleHSTSUnit(unit) {
    const { api } = this.model.options.security.hsts;

    this.hstsMaxAgeValue = CdnSharedSettingsController.getFormattedHstsNumber(
      (api?.config.ttl || 0) / unit.value,
    );
  }

  hasSecurityOptions(config) {
    return [
      this.cdnOptionTypeEnum.CORS,
      this.cdnOptionTypeEnum.HTTPS_REDIRECT,
      this.cdnOptionTypeEnum.HSTS,
      this.cdnOptionTypeEnum.MIXED_CONTENT,
      this.cdnOptionTypeEnum.WAF,
    ].some((key) => config?.options.security[key].api);
  }

  getPrewarmQuotaUsage() {
    const bytes = this.$filter('bytes');
    const { usage, quota } = this.model.options.cache.prewarm.api.extra;

    const convertUsage = bytes(usage || 0, undefined, false, 'B');
    const convertQuota = bytes(quota, undefined, false, 'B');
    const totalUsage = (((usage || 0) / quota) * 100).toFixed(2);

    return `${convertUsage} / ${convertQuota} (${totalUsage}%)`;
  }

  onAdvancedFlushOptionChange(option) {
    this.trackClick(`activate_${option.name}`);

    this.displayChangeCdnOfferModal(this.model);
  }

  onPrewarmOptionClick() {
    this.trackClick('prewarm::edit_urls');

    this.displayPrewarmEditUrlsModal(this.model);
  }

  onPrewarmOptionChange(prewarmStatus) {
    this.trackClick(`${prewarmStatus ? 'activate' : 'deactivate'}_prewarm`);
  }

  onQueryStringOptionChange(queryStringStatus) {
    this.trackClick(
      `${queryStringStatus ? 'activate' : 'deactivate'}_query_string`,
    );
  }

  onQueryStringParamChange() {
    this.trackClick(
      `query_string::${this.model.options.cache.querystring.api.config.queryParameters}_parameter`,
    );
  }

  onGeoLocationOptionChange(geoLocationStatus) {
    this.trackClick(
      `${
        geoLocationStatus ? 'activate' : 'deactivate'
      }_geolocation_http_header`,
    );
  }

  onPrefetchOptionChange(prefetchStatus) {
    this.trackClick(`${prefetchStatus ? 'activate' : 'deactivate'}_prefetch`);
  }

  onMobileRedirectOptionChange(mobileRedirectStatus) {
    this.trackClick(
      `${mobileRedirectStatus ? 'activate' : 'deactivate'}_mobile_redirect`,
    );
  }

  onMobileRedirectStrategyChange() {
    const { selected, api } = this.model.options.perf.mobile_redirect;
    api.config.followUri =
      selected === SHARED_CDN_OPTIONS.MOBILE_REDIRECT.KEEP_URL;

    this.trackClick(`mobile_redirect::redirect_${selected}_url`);
  }

  openConfirmModal() {
    const { rules, ...model } = this.model;
    this.displayConfirmSettingsModal({
      rules,
      model,
      oldModel: this.copyModel,
    });
    this.trackClick('apply-configuration');
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
