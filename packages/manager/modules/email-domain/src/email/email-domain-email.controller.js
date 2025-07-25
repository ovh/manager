import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import round from 'lodash/round';
import punycode from 'punycode';

const emailsConfigurationGuides = {
  DE: 'https://www.ovh.de/g1474.allgemeine-informationen-ovh-webhosting-mails',
  ES: 'https://www.ovh.es/g1474.correo-alojamiento-compartido-ovh',
  FI: 'https://www.ovh-hosting.fi/g1474.yleista-ovh-webhotellit-sahkopostit',
  FR: 'https://docs.ovh.com/fr/fr/web/emails/',
  GB: 'https://www.ovh.co.uk/g1474.ovh-mails-general-use',
  IT: 'https://www.ovh.it/g1474.info-email-condivise-ovh',
  NL: 'https://www.ovh.nl/g1474.algemene-informatie-ovh-webhosting-emails',
  PL: 'https://www.ovh.pl/g1474.emaile-na-hostingu-www-ovh',
  PT: 'https://www.ovh.pt/g1474.generalidades-mails-partilhados-ovh',
};

export default class EmailDomainEmailCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $timeout,
    $translate,
    $window,
    Alerter,
    constants,
    coreConfig,
    goToAccountMigration,
    goToAcl,
    goToFilter,
    goToRedirection,
    goToResponders,
    WucEmails,
    ovhUserPref,
    WucUser,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;

    this.Alerter = Alerter;
    this.constants = constants;
    this.coreConfig = coreConfig;
    this.goToAccountMigration = goToAccountMigration;
    this.goToAcl = goToAcl;
    this.goToFilter = goToFilter;
    this.goToRedirection = goToRedirection;
    this.goToResponders = goToResponders;
    this.WucEmails = WucEmails;
    this.ovhUserPref = ovhUserPref;
    this.WucUser = WucUser;
  }

  $onInit() {
    this.emailsDetails = [];
    this.emailIsUnavailable = true;
    this.userPreferences = null;
    this.loading = {
      accounts: false,
      emails: false,
      pager: false,
    };
    this.search = { accounts: null };
    this.works = {};
    this.statusWorksDone = ['closed', 'finished'];

    this.$scope.guide = get(
      emailsConfigurationGuides,
      this.coreConfig.getUser().ovhSubsidiary,
      emailsConfigurationGuides.FR,
    );

    this.$scope.$on('hosting.tabs.emails.refresh', () =>
      this.refreshAllInfos(true),
    );

    this.initialLoad();
  }

  initialLoad() {
    this.loading.emails = true;

    this.$q
      .all({
        allDomains: this.WucEmails.getDomains(),
        quotas: this.WucEmails.getQuotas(this.$stateParams.productId),
        summary: this.WucEmails.getSummary(this.$stateParams.productId),
      })
      .then(({ allDomains, quotas, summary }) => {
        this.webMailUrl = this.coreConfig.isRegion('EU')
          ? 'https://mail.ovh.net/'
          : null;
        this.webOMMUrl = this.coreConfig.isRegion('EU')
          ? 'https://omm.ovh.net/'
          : null;
        this.domains = allDomains;
        this.quotas = quotas;
        this.summary = summary;
      })
      .then(() => this.ovhUserPref.getValue('WEB_EMAILS'))
      .then((userPreferences) => {
        this.userPreferences = userPreferences;
      })
      .finally(() => {
        if (includes(this.domains, this.$stateParams.productId)) {
          this.refreshTableAccounts();
          this.emailIsUnavailable = false;
        } else {
          this.emailIsUnavailable = true;
        }

        this.loading.emails = false;
      });
  }

  refreshAllInfos(force) {
    this.$q
      .all({
        accounts: this.refreshTableAccounts(force || false),
        summary: this.WucEmails.getSummary(this.$stateParams.productId),
      })
      .then(({ summary }) => {
        this.summary = summary;
      });
  }

  refreshSummary() {
    return this.WucEmails.getSummary(this.$stateParams.productId).then(
      (summary) => {
        this.summary = summary;
      },
    );
  }

  //---------------------------------------------
  // Navigation
  //---------------------------------------------
  openWebMailTab() {
    this.$window.open(this.webMailUrl, '_blank');
  }

  //---------------------------------------------
  // Search
  //---------------------------------------------

  emptySearch() {
    this.search.accounts = '';
    this.loading.search = true;
    this.refreshTableAccounts(true);
  }

  goSearch() {
    this.loading.search = true;
    this.refreshTableAccounts(true);
  }

  //---------------------------------------------
  // Accounts
  //---------------------------------------------

  canAddAccount() {
    return (
      this.emails != null &&
      (!includes(this.emails, 'postmaster') ||
        this.emails.length < this.quotas.account + 1)
    );
  }

  refreshTableAccounts(forceRefresh) {
    this.loading.accounts = true;
    this.emails = null;

    return this.WucEmails.getEmails(this.$stateParams.productId, {
      accountName: `%${this.search.accounts || ''}%`,
      forceRefresh,
    })
      .then((data) => {
        this.emails = data.sort();

        const userWantsHelpHidden = get(
          this.userPreferences,
          'hideEmailsHelp',
          false,
        );
        const userWantsHelpHiddenForCurrentProduct = get(
          this.userPreferences,
          `${this.$stateParams.productId}.hideEmailsHelp`,
          false,
        );

        const shouldShowHelp =
          !userWantsHelpHidden && !userWantsHelpHiddenForCurrentProduct;
        const guidesAlreadyRetrieved =
          has(this.$scope, 'guides.emailsConfiguration') ||
          has(this.$scope, 'guides.emailsCreation');
        const canCreateAccounts = get(this.quotas, 'account', 0) > 0;
        const userMustCreateAccount =
          (this.emails.length === 1 && this.emails[0] === 'postmaster') ||
          isEmpty(this.emails);

        if (
          shouldShowHelp &&
          !guidesAlreadyRetrieved &&
          !this.search.accounts &&
          canCreateAccounts &&
          userMustCreateAccount
        ) {
          this.$timeout(() => {
            if (this.quotas != null) {
              this.$scope.setAction(
                'email-domain/email/help/email-domain-email-help',
                {
                  productId: this.$stateParams.productId || null,
                  quotas: this.quotas,
                  summary: this.summary,
                  emails: this.emails,
                },
              );
            }
          });
        }
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_table_accounts_error'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        if (isEmpty(this.emails)) {
          this.loading.accounts = false;
        }
      });
  }

  transformItem(item) {
    return this.$q
      .all({
        account: this.WucEmails.getEmail(this.$stateParams.productId, item),
        tasks: this.WucEmails.getEmailTasks(this.$stateParams.productId, item),
        usage: this.WucEmails.getEmailUsage(this.$stateParams.productId, item),
      })
      .then(({ account, tasks, usage }) => {
        const clonedAccount = cloneDeep(account);
        clonedAccount.taskDoing = !isEmpty(tasks.data);
        clonedAccount.description = punycode.toUnicode(
          clonedAccount.description,
        );
        clonedAccount.quota = usage.quota;
        clonedAccount.date = usage.date;

        if (clonedAccount.size > 0) {
          clonedAccount.percentUse = round(
            (clonedAccount.quota * 100) / clonedAccount.size,
          );
        } else {
          clonedAccount.percentUse = 0;
        }

        return clonedAccount;
      });
  }

  onTransformItemDone() {
    this.loading.accounts = false;
    this.loading.pager = false;
  }
}
