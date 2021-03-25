import angular from 'angular';
import clone from 'lodash/clone';

export default class SummaryController {
  /* @ngInject */
  constructor(
    constants,
    wucExchange,
    ExchangeDomains,
    EXCHANGE_MX_CONFIG,
    messaging,
    navigation,
    $translate,
    $rootScope,
    wizardHostedCreationEmailCreation,
  ) {
    this.constants = constants;
    this.wucExchange = wucExchange;
    this.ExchangeDomains = ExchangeDomains;
    this.EXCHANGE_MX_CONFIG = EXCHANGE_MX_CONFIG;
    this.messaging = messaging;
    this.navigation = navigation;
    this.$translate = $translate;
    this.$rootScope = $rootScope;
    this.wizardHostedCreationEmailCreation = wizardHostedCreationEmailCreation;
  }

  $onInit() {
    this.$routerParams = this.wucExchange.getParams();
    this.exchange = this.wucExchange.value;
    this.$rootScope.$on('exchange.wizard.request.done', () => {
      this.retrievingEmailAccounts();
    });

    const mxAndSRVTooltipFirstSentence = this.$translate.instant(
      'exchange_wizardHostedCreation_configureDNSZone_manual_explanation_tooltip_1',
    );
    const mxAndSRVTooltipSecondSentence = this.$translate.instant(
      'exchange_wizardHostedCreation_configureDNSZone_manual_explanation_tooltip_2',
    );
    this.tooltipText = `${mxAndSRVTooltipFirstSentence}<br /><br />${mxAndSRVTooltipSecondSentence}`;

    this.isLoading = true;
    this.homepage
      .savingCheckpoint()
      .then(() => this.retrievingEmailAccounts())
      .then(() => this.retrievingDNSSettings())
      .finally(() => {
        this.isLoading = false;
      });
  }

  closeWizard() {
    this.$rootScope.$broadcast('exchange.wizard_hosted_creation.hide');

    if (this.homepage.isAutoConfigurationMode) {
      this.navigation.setAction(
        'exchange/wizard-hosted-creation/summary/automatic/automatic',
        {
          domainName: this.homepage.domainName,
        },
      );
    } else {
      this.navigation.setAction(
        'exchange/wizard-hosted-creation/summary/manual/manual',
        {
          domainName: this.homepage.domainName,
        },
      );
    }

    return this.homepage.deletingCheckpoint();
  }

  retrievingDNSSettings() {
    return this.ExchangeDomains.gettingDNSSettings(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.homepage.domainName,
    )
      .then((data) => {
        this.domainDiagnostic = data;

        if (this.constants.target === 'CA') {
          this.domainDiagnostic.mx.spam = this.EXCHANGE_MX_CONFIG.CA.spam;
        } else if (this.constants.target === 'EU') {
          this.domainDiagnostic.mx.spam = this.EXCHANGE_MX_CONFIG.EU.spam;
        }

        if (this.domainDiagnostic.isOvhDomain) {
          this.model = {
            antiSpam: false,
          };
        }
      })
      .catch((failure) => {
        this.navigation.resetAction();
        this.messaging.writeError(
          this.$translate.instant(
            'exchange_tab_domain_diagnostic_add_field_failure',
          ),
          failure,
        );
      });
  }

  goBackToEmailCustomization() {
    this.homepage.shouldDisplayFirstStep = true;
    this.homepage.shouldDisplaySummary = false;
    this.homepage.navigationState = 'email-creation';

    return this.homepage.savingCheckpoint();
  }

  retrievingEmailAccounts(count, offset) {
    return this.wizardHostedCreationEmailCreation
      .retrievingAccounts(
        this.$routerParams.organization,
        this.$routerParams.productId,
        '',
        count,
        offset,
      )
      .then((accounts) => {
        const copy = clone(accounts);
        copy.list.results = accounts.list.results.filter(
          (currentAccount) =>
            currentAccount.domain === this.homepage.domainName,
        );
        copy.count = copy.list.results.length;
        this.homepage.emailAccounts = copy;
        this.hasEmailAddresses =
          angular.isArray(this.homepage.emailAccounts.list.results) &&
          this.homepage.emailAccounts.count > 0;
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant(
            'exchange_wizardHostedCreation_configureDNSZone_availableAccountsRetrieval_error',
          ),
          error,
        );
      });
  }
}
