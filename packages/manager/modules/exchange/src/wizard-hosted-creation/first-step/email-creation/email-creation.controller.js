import angular from 'angular';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';

export default class EmailCreationController {
  /* @ngInject */
  constructor(
    wucExchange,
    exchangeStates,
    messaging,
    navigation,
    $translate,
    $rootScope,
    $scope,
    $timeout,
    wizardHostedCreationDomainConfiguration,
    wizardHostedCreationEmailCreation,
  ) {
    this.wucExchange = wucExchange;
    this.exchangeStates = exchangeStates;
    this.messaging = messaging;
    this.navigation = navigation;
    this.$translate = $translate;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.wizardHostedCreationDomainConfiguration = wizardHostedCreationDomainConfiguration;
    this.wizardHostedCreationEmailCreation = wizardHostedCreationEmailCreation;
  }

  $onInit() {
    this.$routerParams = this.wucExchange.getParams();
    this.$rootScope.$on('exchange.wizard.request.done', () => {
      this.retrievingEmailAccounts();
    });

    this.$scope.retrievingEmailAccounts = (count, offset) =>
      this.retrievingEmailAccounts(count, offset);
    this.$scope.getEmailAccounts = () => this.homepage.otherAccounts;
    this.$scope.getIsLoading = () => this.isLoading;

    return this.$timeout(() =>
      this.retrievingEmailAccounts().finally(() => {
        if (this.homepage.numberOfAvailableAccounts === 0) {
          this.$rootScope.$broadcast('exchange.wizard_hosted_creation.hide');
          this.homepage.deletingCheckpoint();
        } else {
          this.scrollToBottom();
        }
      }),
    );
  }

  scrollToBottom() {
    this.$timeout(() => {
      document
        .getElementById('email-creation-main-container')
        .scrollIntoView(false);
    });
  }

  scrollToTop() {
    this.$timeout(() => {
      document.getElementById('wizard-error-message').scrollIntoView(true);
    });
  }

  static getDisplayName(account) {
    return !isEmpty(account.displayName) ? account.displayName : account.login;
  }

  refreshTable() {
    if (!this.isLoading) {
      this.$rootScope.$broadcast('paginationServerSide.loadPage', 1);
    }
  }

  retrievingAvailableEmailAccounts() {
    return this.wizardHostedCreationEmailCreation
      .retrievingAvailableAccounts(
        this.$routerParams.organization,
        this.$routerParams.productId,
      )
      .then((availableAccounts) => {
        this.homepage.availableAccounts = availableAccounts.filter((account) =>
          this.exchangeStates.constructor.isOk(account),
        );
        this.homepage.numberOfAvailableAccounts = this.homepage.availableAccounts.length;
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

  retrievingEmailAccounts() {
    this.isLoading = true;

    return this.wizardHostedCreationEmailCreation
      .retrievingAccounts(
        this.$routerParams.organization,
        this.$routerParams.productId,
      )
      .then((accounts) =>
        this.wizardHostedCreationEmailCreation.retrievingAccounts(
          this.$routerParams.organization,
          this.$routerParams.productId,
          this.homepage.domainName,
          accounts.count,
        ),
      )
      .then((accounts) => {
        this.homepage.otherAccounts = accounts;
        return this.retrievingAvailableEmailAccounts();
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant(
            'exchange_wizardHostedCreation_configureDNSZone_availableAccountsRetrieval_error',
          ),
          error,
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  updateEmailAccount(account) {
    this.navigation.setAction(
      'exchange/wizard-hosted-creation/first-step/email-creation/update/update',
      angular.copy(account),
    );
  }

  removeEmailAccount(account) {
    this.navigation.setAction(
      'exchange/wizard-hosted-creation/first-step/email-creation/delete/delete',
      angular.copy(account),
    );
  }

  thereAreOperationsPending() {
    if (!isObject(this.homepage.otherAccounts)) {
      return false;
    }

    const thereAreAccountsBeingDeleted = !isEmpty(
      this.homepage.otherAccounts.list.results.filter((account) =>
        this.exchangeStates.constructor.isDeleting(account),
      ),
    );
    const thereIsNoRoomForMoreAccountCreation =
      this.homepage.numberOfAvailableAccounts === 0;

    return thereIsNoRoomForMoreAccountCreation && thereAreAccountsBeingDeleted;
  }

  atLeastOneEmailIsCustomized() {
    if (!isObject(this.homepage.otherAccounts)) {
      return false;
    }

    const atLeastOneEmailIsCustomized = !isEmpty(
      this.homepage.otherAccounts.list.results.filter(
        (account) => !this.exchangeStates.constructor.isDeleting(account),
      ),
    );

    return atLeastOneEmailIsCustomized;
  }

  goToSummary() {
    this.homepage.shouldDisplaySummary = true;
    this.homepage.shouldDisplayFirstStep = false;
  }
}
