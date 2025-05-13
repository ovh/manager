import clone from 'lodash/clone';
import every from 'lodash/every';
import lodashFilter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';

export default class EmailsEditFilterCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.account = angular.copy(this.$scope.currentActionData.account);
    this.accounts = map(
      this.$scope.currentActionData.accounts,
      (account) => `${account}@${this.account.domain}`,
    );
    this.filter = angular.copy(this.$scope.currentActionData.filter);
    this.headers = ['From', 'To', 'Subject', 'other'];
    this.loading = false;

    this.getModels();

    this.$scope.updateFilter = () => this.updateFilter();
  }

  getModels() {
    this.loading = true;
    this.WucEmails.getModels()
      .then((models) => {
        this.actions = models.models['domain.DomainFilterActionEnum'].enum;
        this.operands = models.models['domain.DomainFilterOperandEnum'].enum;

        if (get(this.$scope.currentActionData, 'delegate', false)) {
          return this.WucEmails.getDelegatedRules(
            this.account.email,
            this.filter.name,
          );
        }
        return this.WucEmails.getRules(
          this.$stateParams.productId,
          this.account.accountName,
          this.filter.name,
        );
      })
      .catch(() => {
        this.actions = [];
        this.operands = [];
      })
      .then((rules) => {
        if (rules != null) {
          this.filter.rules = rules.map((originalRule) => {
            const rule = clone(originalRule);

            const matchingHeader = this.headers.find(
              (header) => header === rule.header,
            );

            if (matchingHeader == null) {
              rule.headerSelect = 'other';
            } else {
              rule.headerSelect = rule.header;
            }

            return rule;
          });
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  addRule() {
    this.filter.rules.push({
      header: '',
      operand: '',
      value: '',
      headerSelect: '',
    });
  }

  removeRule(rule) {
    this.filter.rules.splice(this.filter.rules.indexOf(rule), 1);
  }

  filterActionRedirectCheck() {
    const input = this.editFilterForm.filterActionParam;
    const value = input.$viewValue;
    input.$setValidity(
      'filterActionRedirect',
      !!value &&
        /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(value) &&
        !/^\./.test(value),
    );
  }

  filterPriorityCheck() {
    const input = this.editFilterForm.filterPriority;
    const value = input.$viewValue;
    input.$setValidity('filterPriority', !!value && /^[0-9]+$/.test(value));
  }

  filterRuleCheck() {
    return every(
      this.filter.rules,
      (rule) =>
        rule.value &&
        rule.operand &&
        ((rule.headerSelect && rule.headerSelect !== 'other') ||
          (rule.headerSelect === 'other' && rule.header)),
    );
  }

  updateFilter() {
    this.loading = true;
    const rules = map(
      lodashFilter(
        this.filter.rules,
        (rule) =>
          (rule.headerSelect !== '' || rule.header !== '') &&
          rule.operand !== '' &&
          rule.value !== '',
      ),
      (rule) => ({
        operand: rule.operand,
        value: rule.value,
        header: rule.headerSelect === 'other' ? rule.header : rule.headerSelect,
      }),
    );
    const rule = rules.shift();

    const { filter } = this;
    delete filter.rules;
    delete filter.domain;
    delete filter.pop;
    filter.header = rule.header;
    filter.operand = rule.operand;
    filter.value = rule.value;

    let filterPromise;
    if (get(this.$scope.currentActionData, 'delegate', false)) {
      filterPromise = this.WucEmails.updateDelegatedFilter(
        this.account.email,
        filter,
        rules,
      );
    } else {
      filterPromise = this.WucEmails.updateFilter(
        this.$stateParams.productId,
        this.account.accountName,
        filter,
        rules,
      );
    }

    return filterPromise
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('email_tab_modal_edit_filter_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_edit_filter_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading = false;
        this.$scope.resetAction();
      });
  }
}
