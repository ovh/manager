import filter from 'lodash/filter';
import get from 'lodash/get';
import set from 'lodash/set';
import { EMAIL_TYPE } from './emailpro-information-tab.constant';

export default class EmailProTabInformationCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $stateParams,
    $translate,
    coreURLBuilder,
    Alerter,
    EmailPro,
    EmailProMXPlanMailingLists,
    WucEmails,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.Alerter = Alerter;
    this.EmailPro = EmailPro;
    this.EmailProMXPlanMailingLists = EmailProMXPlanMailingLists;
    this.WucEmails = WucEmails;
    this.EMAIL_TYPE = EMAIL_TYPE;
  }

  $onInit() {
    this.loading = {
      accounts: this.$scope.exchange.isMXPlan,
      email: this.$scope.exchange.isMXPlan,
      mailingLists: this.$scope.exchange.isMXPlan,
      quotas: this.$scope.exchange.isMXPlan,
      redirections: this.$scope.exchange.isMXPlan,
    };

    if (this.$scope.exchange.isMXPlan) {
      this.$q.all({
        quotas: this.$scope.currentRegionCA
          ? this.$q.when({})
          : this.getQuotas(),
        accounts: this.getAccountsConfigured(),
        emailsDomain: this.$scope.currentRegionCA
          ? this.$q.when({})
          : this.getEmailsDomain(),
        mailingLists: this.$scope.currentRegionCA
          ? this.$q.when({})
          : this.getMailingLists(),
        redirections: this.$scope.currentRegionCA
          ? this.$q.when({})
          : this.getRedirections(),
      });

      this.upgradeLink = this.$state.href('mxplan.dashboard.upgrade', {
        productId: this.$stateParams.productId,
        domain: this.$scope.exchange.associatedDomainName,
      });
    }

    if (this.$scope.sharepoint) {
      this.sharepointURL = this.coreURLBuilder.buildURL(
        'dedicated',
        '#/sharepoint/:exchangeId/:productId',
        {
          exchangeId: this.$scope.exchange.domain,
          productId: this.$scope.sharepoint?.domain,
        },
      );
    }
  }

  getQuotas() {
    this.loading.quotas = true;
    return this.WucEmails.getQuotas(
      get(this.$scope, 'exchange.associatedDomainName'),
    )
      .then((quotas) => {
        this.$scope.quotas = quotas;
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.loading.quotas = false;
      });
  }

  getAccountsConfigured() {
    this.EmailPro.getAccountIds({
      exchangeService: this.$scope.exchange.domain,
    })
      .then((accounts) => {
        const accountsConfigured = filter(
          accounts,
          (account) => !/.*configureme\.me$/.test(account),
        );
        this.$scope.accountsConfigured = accountsConfigured;
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.loading.accounts = false;
      });
  }

  getMailingLists() {
    this.loading.mailingLists = true;
    return this.EmailProMXPlanMailingLists.getEmailProMXPlanMailingLists(
      get(this.$scope, 'exchange.associatedDomainName'),
      {
        name: '%',
        forceRefresh: true,
      },
    )
      .then((data) => {
        this.$scope.mailingLists = data;
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.loading.mailingLists = false;
      });
  }

  getRedirections() {
    this.loading.redirections = true;
    return this.WucEmails.getRedirections(
      get(this.$scope, 'exchange.associatedDomainName'),
    )
      .then((data) => {
        this.$scope.redirections = data.map((id) => ({ id }));
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
          set(err, 'type', err.type || 'ERROR'),
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading.redirections = false;
      });
  }

  getEmailsDomain() {
    this.loading.email = false;
    return this.WucEmails.getDomain(
      get(this.$scope, 'exchange.associatedDomainName'),
    )
      .then((data) => {
        this.$scope.emailDomain = data;
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
          set(err, 'type', err.type || 'ERROR'),
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading.email = false;
      });
  }
}
