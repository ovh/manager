import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import includes from 'lodash/includes';
import startsWith from 'lodash/startsWith';

import punycode from 'punycode';

export default class DomainConfigurationController {
  /* @ngInject */
  constructor(
    wucExchange,
    ExchangeDomains,
    exchangeStates,
    messaging,
    $rootScope,
    $timeout,
    $translate,
    WucUser,
    wizardHostedCreationDomainConfiguration,
  ) {
    this.wucExchange = wucExchange;
    this.ExchangeDomains = ExchangeDomains;
    this.exchangeStates = exchangeStates;
    this.messaging = messaging;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.WucUser = WucUser;
    this.wizardHostedCreationDomainConfiguration = wizardHostedCreationDomainConfiguration;
  }

  $onInit() {
    this.initialLoading = true;
    this.$routerParams = this.wucExchange.getParams();
    this.loaders = {
      isInitialRetrievalRunning: true,
      IsWaitingForDomainAssociation: false,
      IsWaitingForCNAME: false,
    };

    const savedDomainName = this.homepage.domainName;

    this.homepage.domainHasBeenAssociated = false;

    if (!this.homepage.isShowingEmailCustomization) {
      this.homepage.isShowingEmailCustomization = false;
    }

    this.userHasTriedToAssociatedNonAutoritativeDomain = false;

    this.tooltipText = this.$translate.instant(
      'exchange_wizardHostedCreation_addDomainName_domainNameSelection_ovhDomain_dnsZone_tooltip',
    );
    const firstSentenceTooltip = this.$translate.instant(
      'exchange_wizardHostedCreation_addDomainName_domainNameSelection_ovhDomain_mxRelay_tooltip_1',
    );
    const secondSentenceTooltip = this.$translate.instant(
      'exchange_wizardHostedCreation_addDomainName_domainNameSelection_ovhDomain_mxRelay_tooltip_2',
    );
    this.mxRelayTooltip = `${firstSentenceTooltip}<br /><br />${secondSentenceTooltip}`;
    const mxAndSRVTooltipFirstSentence = this.$translate.instant(
      'exchange_wizardHostedCreation_configureDNSZone_manual_explanation_tooltip_1',
    );
    const mxAndSRVTooltipSecondSentence = this.$translate.instant(
      'exchange_wizardHostedCreation_configureDNSZone_manual_explanation_tooltip_2',
    );
    this.mxAndSRVTooltipText = `${mxAndSRVTooltipFirstSentence}<br /><br />${mxAndSRVTooltipSecondSentence}`;

    return this.retrieveURLToOrderDomains()
      .then(() => this.retrievingDomainNames())
      .then(() => {
        this.homepage.domainName = savedDomainName;

        const domainNameWasRetrievedFromPreferences = !isEmpty(
          this.homepage.domainName,
        );
        if (domainNameWasRetrievedFromPreferences) {
          if (this.homepage.domainIsNotManagedByCurrentNIC) {
            this.loaders.IsWaitingForCNAME = true;
          } else {
            this.availableDomainNames = [this.homepage.domainName];
            this.homepage.shouldDisabledDomainSelection = true;
          }

          return this.retrievingSavedDomain();
        }

        return null;
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant(
            'exchange_wizardHostedCreation_addDomainName_retrieval_error',
          ),
          error,
        );
        this.scrollToTop();
      })
      .finally(() => {
        this.loaders.isInitialRetrievalRunning = false;
        this.clipboard1 = new Clipboard(document.querySelector('#copyButton1'));
        this.clipboard2 = new Clipboard(document.querySelector('#copyButton2'));
        this.scrollToBottom();
      });
  }

  retrieveURLToOrderDomains() {
    return this.WucUser.getUrlOf('domainOrder').then((urlToOrderDomains) => {
      this.urlToOrderDomains = urlToOrderDomains;
    });
  }

  retrievingDomainNames() {
    const { domainName } = this.homepage;

    return this.ExchangeDomains.retrievingDataToCreateDomains(
      this.$routerParams.organization,
      this.$routerParams.productId,
    )
      .then((domainData) => {
        this.availableDomainNames = domainData.availableDomains.map(
          (domain) => domain.name,
        );
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant(
            'exchange_wizardHostedCreation_addDomainName_retrieval_error',
          ),
          error,
        );
        this.scrollToTop();
      })
      .finally(() => {
        this.homepage.domainName = domainName;
      });
  }

  retrievingSavedDomain() {
    return this.wizardHostedCreationDomainConfiguration
      .retrievingDomain(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.homepage.domainName,
      )
      .then((domain) => {
        if (domain.taskPendingId !== 0) {
          this.loaders.isInitialRetrievalRunning = false;

          return this.wizardHostedCreationDomainConfiguration
            .retrievingTask(
              this.$routerParams.organization,
              this.$routerParams.productId,
              domain.taskPendingId,
            )
            .then((domainCreationTask) => ({ domain, domainCreationTask }));
        }

        if (this.exchangeStates.constructor.isDeleting(domain)) {
          // eslint-disable-next-line no-throw-literal
          throw null;
        }

        return null;
      })
      .then((data) => {
        if (data == null) {
          return null;
        }

        this.loaders.IsWaitingForDomainAssociation = true;
        this.scrollToBottom();
        return this.wizardHostedCreationDomainConfiguration.pollingCNAMEToCheck(
          this.$routerParams.organization,
          this.$routerParams.productId,
          data.domain.name,
          data.domainCreationTask,
        );
      })
      .then((domainCreationPollingData) => {
        if (isObject(domainCreationPollingData)) {
          const isWaitingForCNAME = !isEmpty(
            domainCreationPollingData.cnameToCheck,
          );

          if (isWaitingForCNAME) {
            this.loaders.IsWaitingForCNAME = true;
            this.homepage.domainHasBeenAssociated = true;
            this.homepage.cnameToCheck = `${domainCreationPollingData.cnameToCheck}.${domainCreationPollingData.name}`;
            this.homepage.domainIsNotManagedByCurrentNIC = true;

            return this.homepage
              .savingCheckpoint()
              .then(() =>
                this.wizardHostedCreationDomainConfiguration.polling(
                  this.$routerParams.organization,
                  this.$routerParams.productId,
                  domainCreationPollingData.taskPendingId,
                ),
              );
          }
        }

        return null;
      })
      .then(() => {
        this.loaders.IsWaitingForCNAME = false;
        this.loaders.IsWaitingForDomainAssociation = false;
        this.homepage.domainHasBeenAssociated = true;
        this.homepage.isShowingEmailCustomization = true;
        this.displayEmailCreation();

        return this.homepage.savingCheckpoint();
      })
      .catch(() => {
        this.homepage.deletingCheckpoint();
      });
  }

  onAnotherDomainCheckboxClick() {
    this.homepage.domainName = '';

    this.homepage.domainIsOnlyForExchange = null;
    this.homepage.domainIsAssociatedToEmailService = null;
    this.homepage.isAutoConfigurationMode = null;
    this.displayedMXRelay = null;
    this.userHasTriedToAssociatedNonAutoritativeDomain = false;
    this.domainNameForm.$setPristine();
    this.scrollToBottom();
  }

  closeWizard() {
    return this.homepage.deletingCheckpoint().finally(() => {
      this.$rootScope.$broadcast('exchange.wizard_hosted_creation.hide');
    });
  }

  reinitializeCNAMEToCheck() {
    this.homepage.cnameToCheck = '';
  }

  checkIfDomainIsManagedByThisNIC() {
    this.domainNameForm.foreignDomainName.$setValidity(
      'isOVHDomain',
      !includes(this.availableDomainNames, this.homepage.domainName),
    );
  }

  checkIfExternalDomainIsValid() {
    if (isEmpty(this.homepage.domainName)) {
      this.domainNameForm.foreignDomainName.$setValidity('pattern', true);
    } else {
      const formattedDomainName = punycode.toASCII(
        this.homepage.domainName.replace(/^www\./, ''),
      );
      this.domainNameForm.foreignDomainName.$setValidity(
        'pattern',
        /^(?:[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9-]+)*)(?:(?:\.|\+)(?:[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*))*(?:\.[a-zA-Z]{2,})$/.test(
          formattedDomainName,
        ),
      );
    }
  }

  onDomainNameSelectionChange() {
    if (this.initialLoading) {
      this.initialLoading = false;
    } else {
      this.homepage.domainIsOnlyForExchange = null;
      this.homepage.isAutoConfigurationMode = null;
      this.homepage.domainIsAssociatedToEmailService = null;
      this.homepage.mxRelay = null;
      this.userHasTriedToAssociatedNonAutoritativeDomain = false;

      this.scrollToBottom();
    }
  }

  onDomainIsOnlyForExchangeSelection() {
    this.homepage.mxRelay = null;
    this.homepage.isAutoConfigurationMode = null;
    this.homepage.domainIsAssociatedToEmailService = null;

    this.scrollToBottom();
  }

  onIsAssociatedToEmailServiceCheckbox() {
    this.homepage.mxRelay = 'mx1.mail.ovh.net';
    this.displayedMXRelay = '';
    this.homepage.isAutoConfigurationMode = null;

    this.scrollToBottom();
    this.mxRelayForm.$setPristine();
  }

  scrollToBottom() {
    this.$timeout(() => {
      document
        .getElementById('domain-configuration-container')
        .scrollIntoView(false);
    });
  }

  scrollToTop() {
    this.$timeout(() => {
      document.getElementById('wizard-error-message').scrollIntoView(true);
    });
  }

  isAddingButtonDisabled() {
    const domainNameIsOk =
      isString(this.homepage.domainName) && !isEmpty(this.homepage.domainName);
    const authorityIsOk =
      !this.homepage.domainIsNotManagedByCurrentNIC &&
      isBoolean(this.homepage.domainIsOnlyForExchange);
    const configurationModeIsOk =
      !this.homepage.domainIsNotManagedByCurrentNIC &&
      this.homepage.domainIsOnlyForExchange &&
      isBoolean(this.homepage.isAutoConfigurationMode);
    const automaticMXRelayIsOk =
      !this.homepage.domainIsNotManagedByCurrentNIC &&
      !this.homepage.domainIsOnlyForExchange &&
      this.homepage.domainIsAssociatedToEmailService;
    const mxRelayIsOk =
      !this.homepage.domainIsNotManagedByCurrentNIC &&
      !this.homepage.domainIsOnlyForExchange &&
      !this.homepage.domainIsAssociatedToEmailService &&
      isObject(this.mxRelayForm) &&
      this.mxRelayForm.mxRelay.$valid;

    const enoughDataToAdd =
      domainNameIsOk &&
      authorityIsOk &&
      (configurationModeIsOk || mxRelayIsOk || automaticMXRelayIsOk);

    return this.loaders.IsWaitingForCNAME || !enoughDataToAdd;
  }

  configurationIsOver() {
    const formIsValid =
      this.homepage.domainIsAssociatedToEmailService === false &&
      this.mxRelayForm.$valid === true;
    const nonManagedDomainConfigurationIsOver =
      this.homepage.domainIsOnlyForExchange === true ||
      this.homepage.domainIsAssociatedToEmailService === true ||
      formIsValid;
    const nonManagedDomainIsOver =
      this.homepage.domainIsNotManagedByCurrentNIC &&
      nonManagedDomainConfigurationIsOver;
    const managedDomainIsOver =
      !this.homepage.domainIsNotManagedByCurrentNIC &&
      this.homepage.isAutoConfigurationMode != null;

    return nonManagedDomainIsOver || managedDomainIsOver;
  }

  addingDomainAndContinuing() {
    const formattedDomainName = this.homepage.domainName.replace(/^www\./, '');

    return this.addingDomain()
      .then((domainCreationTask) =>
        this.wizardHostedCreationDomainConfiguration
          .pollingCNAMEToCheck(
            this.$routerParams.organization,
            this.$routerParams.productId,
            formattedDomainName,
            domainCreationTask,
          )
          .then((domainCreationPollingData) => {
            this.homepage.domainHasBeenAssociated = true;
            const domainWasCreatedSuccessfully = isEmpty(
              domainCreationPollingData.cnameToCheck,
            );
            this.loaders.IsWaitingForDomainAssociation = false;

            if (domainWasCreatedSuccessfully) {
              this.loaders.IsWaitingForCNAME = false;
              return null;
            }

            // Sometimes the selected domain is not actually managed by the current NIC,
            // so another screen must be used
            this.loaders.IsWaitingForCNAME = true;
            this.homepage.domainIsNotManagedByCurrentNIC = true;
            this.homepage.domainHasBeenAssociated = true;
            this.homepage.cnameToCheck = `${domainCreationPollingData.cnameToCheck}.${domainCreationPollingData.name}`;

            return this.homepage
              .savingCheckpoint()
              .then(() =>
                this.wizardHostedCreationDomainConfiguration.polling(
                  this.$routerParams.organization,
                  this.$routerParams.productId,
                  domainCreationTask,
                ),
              )
              .finally(() => {
                this.loaders.IsWaitingForCNAME = false;
                this.homepage.isShowingEmailCustomization = true;

                return this.homepage.savingCheckpoint();
              });
          }),
      )
      .then(() => {
        this.homepage.domainHasBeenAssociated = true;
        this.homepage.isShowingEmailCustomization = true;
        this.displayEmailCreation();

        return this.homepage.savingCheckpoint();
      })
      .catch((error) => {
        const { domainIsOnlyForExchange } = this.homepage;
        this.onDomainNameSelectionChange();

        if (error.message === 'Authoritative domain detected') {
          if (domainIsOnlyForExchange) {
            this.messaging.writeInfo(
              this.$translate.instant(
                'exchange_wizardHostedCreation_addDomainName_OVHDomain_alreadyNonAuthoritativeEmailPro',
              ),
            );
            this.homepage.domainIsOnlyForExchange = false;
            this.userHasTriedToAssociatedNonAutoritativeDomain = true;
          } else {
            this.messaging.writeWarning(
              this.$translate.instant(
                'exchange_wizardHostedCreation_addDomainName_OVHDomain_alreadyAuthoritativeEmailPro',
              ),
            );
          }
        } else if (startsWith(error.message, 'UPN suffix')) {
          this.messaging.writeError(
            this.$translate.instant(
              'exchange_wizardHostedCreation_addDomainName_OVHDomain_alreadyAssociated_error',
              { t0: formattedDomainName },
            ),
          );
          this.homepage.domainName = '';
        } else {
          this.messaging.writeError(
            this.$translate.instant(
              'exchange_wizardHostedCreation_addDomainName_OVHDomain_error',
            ),
            error,
          );
        }

        this.loaders.IsWaitingForDomainAssociation = false;
        this.homepage.shouldDisabledDomainSelection = false;
        this.scrollToTop();
      });
  }

  addingDomainAndClosing() {
    const formattedDomainName = this.homepage.domainName.replace(/^www\./, '');

    return this.addingDomain()
      .then(() => {
        this.closeWizard();
      })
      .catch((error) => {
        const { domainIsOnlyForExchange } = this.homepage;
        this.onDomainNameSelectionChange();

        if (error.message === 'Authoritative domain detected') {
          if (domainIsOnlyForExchange) {
            this.messaging.writeInfo(
              this.$translate.instant(
                'exchange_wizardHostedCreation_addDomainName_OVHDomain_alreadyNonAuthoritativeEmailPro',
              ),
            );
            this.homepage.domainIsOnlyForExchange = false;
            this.userHasTriedToAssociatedNonAutoritativeDomain = true;
          } else {
            this.messaging.writeWarning(
              this.$translate.instant(
                'exchange_wizardHostedCreation_addDomainName_OVHDomain_alreadyAuthoritativeEmailPro',
              ),
            );
          }
        } else if (startsWith(error.message, 'UPN suffix')) {
          this.messaging.writeError(
            this.$translate.instant(
              'exchange_wizardHostedCreation_addDomainName_OVHDomain_alreadyAssociated_error',
              { t0: formattedDomainName },
            ),
          );
          this.homepage.domainName = '';
        } else {
          this.messaging.writeError(
            this.$translate.instant(
              'exchange_wizardHostedCreation_addDomainName_OVHDomain_error',
            ),
            error,
          );
        }

        this.loaders.IsWaitingForDomainAssociation = false;
        this.homepage.shouldDisabledDomainSelection = false;
        this.scrollToTop();
      });
  }

  addingDomain() {
    this.homepage.shouldDisabledDomainSelection = true;
    this.loaders.IsWaitingForDomainAssociation = true;
    const formattedDomainName = punycode.toASCII(
      this.homepage.domainName.replace(/^www\./, ''),
    );

    const data = {
      name: formattedDomainName,
      configureAutodiscover: !this.homepage.domainIsNotManagedByCurrentNIC
        ? this.homepage.isAutoConfigurationMode
        : false,
      configureMx: !this.homepage.domainIsNotManagedByCurrentNIC
        ? this.homepage.isAutoConfigurationMode
        : false,
      main: false,
      type: this.homepage.domainIsOnlyForExchange
        ? 'authoritative'
        : 'nonAuthoritative',
    };

    if (this.homepage.domainIsAssociatedToEmailService != null) {
      this.homepage.mxRelay = this.displayedMXRelay;
      data.mxRelay = this.homepage.mxRelay;
    }

    this.scrollToBottom();
    return this.homepage
      .savingCheckpoint()
      .then(() =>
        this.wizardHostedCreationDomainConfiguration.retrievingDomain(
          this.$routerParams.organization,
          this.$routerParams.productId,
          this.homepage.domainName,
        ),
      )
      .catch(() => null)
      .then((domain) => {
        const domainState = get(domain, 'state');

        if (!isString(domainState)) {
          return this.wizardHostedCreationDomainConfiguration.addingDomain(
            this.$routerParams.organization,
            this.$routerParams.productId,
            data,
          );
        }

        return null;
      });
  }

  displayEmailCreation() {
    this.displayComponent({ componentName: 'email-creation' });
  }
}
