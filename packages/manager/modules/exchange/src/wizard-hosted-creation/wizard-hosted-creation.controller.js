import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import set from 'lodash/set';

import { PREFERENCE_CHECKPOINT } from './wizard-hosted-creation.constants';

export default class WizardHostedCreationController {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $timeout,
    $translate,
    wucExchange,
    exchangeStates,
    messaging,
    navigation,
    ovhUserPref,
    wizardHostedCreationDomainConfiguration,
    wizardHostedCreationEmailCreation,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$translate = $translate;

    this.wucExchange = wucExchange;
    this.exchangeStates = exchangeStates;
    this.messaging = messaging;
    this.navigation = navigation;
    this.ovhUserPref = ovhUserPref;
    this.wizardHostedCreationDomainConfiguration = wizardHostedCreationDomainConfiguration;
    this.wizardHostedCreationEmailCreation = wizardHostedCreationEmailCreation;
  }

  $onInit() {
    this.$routerParams = this.wucExchange.getParams();
    this.navigationState = '';

    return this.fetchingIfShouldDisplayWizard().then((shouldDisplayWizard) => {
      if (shouldDisplayWizard) {
        this.shouldDisplayFirstStep = true;
        this.shouldDisplaySummary = false;
        return this.restoringCheckpoint();
      }

      this.$rootScope.$broadcast('exchange.wizard_hosted_creation.hide');
      return this.deletingCheckpoint();
    });
  }

  fetchingIfShouldDisplayWizard() {
    return this.wizardHostedCreationEmailCreation
      .retrievingAvailableAccounts(
        this.$routerParams.organization,
        this.$routerParams.productId,
      )
      .then(
        (availableAccounts) =>
          !isEmpty(
            availableAccounts.filter((account) =>
              this.exchangeStates.constructor.isOk(account),
            ),
          ),
      )
      .catch(() => false);
  }

  retrievingCheckpoint() {
    return this.ovhUserPref.getValue(PREFERENCE_CHECKPOINT).catch(() => null);
  }

  static createOrUsePreviousPreferences(currentPreferences) {
    const currentPreferencesExist = isObject(currentPreferences);
    const preferencesToUse = currentPreferencesExist ? currentPreferences : {};

    return preferencesToUse;
  }

  createPreferencesForCurrentServiceIfNeeded(preferences) {
    const currentServiceHasPreferences = !isEmpty(
      preferences[this.$routerParams.organization],
    );

    if (!currentServiceHasPreferences) {
      set(preferences, this.$routerParams.organization, {});
    }

    return preferences;
  }

  createPreferencesForCurrentDomain(previousPreferences) {
    const preferencesToUse = WizardHostedCreationController.createOrUsePreviousPreferences(
      previousPreferences,
    );
    const preferencesWithCurrentService = this.createPreferencesForCurrentServiceIfNeeded(
      preferencesToUse,
    );

    preferencesWithCurrentService[this.$routerParams.organization][
      this.domainName
    ] = {
      cnameToCheck: this.cnameToCheck,
      domainIsAssociatedToEmailService: this.domainIsAssociatedToEmailService,
      isAutoConfigurationMode: this.isAutoConfigurationMode,
      mxRelay: this.mxRelay,
      domainIsNotManagedByCurrentNIC: this.domainIsNotManagedByCurrentNIC,
      domainIsOnlyForExchange: this.domainIsOnlyForExchange,
      shouldDisplayFirstStep: this.shouldDisplayFirstStep,
      shouldDisplaySummary: this.shouldDisplaySummary,
      navigationState: this.navigationState,
      domainHasBeenAssociated: this.domainHasBeenAssociated,
      shouldDisabledDomainSelection: this.shouldDisabledDomainSelection,
      isShowingEmailCustomization: this.isShowingEmailCustomization,
    };

    return preferencesWithCurrentService;
  }

  closeMessages() {
    this.messaging.resetMessages();
    this.scrollToBottom();
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

  savingCheckpoint() {
    return this.retrievingCheckpoint().then((retrievedPreferences) => {
      const preferencesToSave = this.createPreferencesForCurrentDomain(
        retrievedPreferences,
      );

      return this.ovhUserPref.create(PREFERENCE_CHECKPOINT, preferencesToSave);
    });
  }

  restoringCheckpoint() {
    return this.retrievingCheckpoint()
      .then((preferences) => {
        if (
          !isObject(preferences) ||
          isEmpty(preferences[this.$routerParams.organization])
        ) {
          return null;
        }

        const firstDomainName = Object.keys(
          preferences[this.$routerParams.organization],
        )[0];
        this.domainName = firstDomainName;

        return this.wizardHostedCreationDomainConfiguration
          .retrievingDomain(
            this.$routerParams.organization,
            this.$routerParams.productId,
            this.domainName,
          )
          .then(() => {
            const preferenceToUse =
              preferences[this.$routerParams.organization][this.domainName];

            this.cnameToCheck = preferenceToUse.cnameToCheck;
            this.domainIsAssociatedToEmailService =
              preferenceToUse.domainIsAssociatedToEmailService;
            this.isAutoConfigurationMode =
              preferenceToUse.isAutoConfigurationMode;
            this.mxRelay = preferenceToUse.mxRelay;
            this.domainIsNotManagedByCurrentNIC =
              preferenceToUse.domainIsNotManagedByCurrentNIC;
            this.domainIsOnlyForExchange =
              preferenceToUse.domainIsOnlyForExchange;
            this.shouldDisplayFirstStep =
              preferenceToUse.shouldDisplayFirstStep;
            this.shouldDisplaySummary = preferenceToUse.shouldDisplaySummary;
            this.navigationState = preferenceToUse.navigationState;
            this.domainHasBeenAssociated =
              preferenceToUse.domainHasBeenAssociated;
            this.shouldDisabledDomainSelection =
              preferenceToUse.shouldDisabledDomainSelection;
            this.isShowingEmailCustomization =
              preferenceToUse.isShowingEmailCustomization;

            return preferenceToUse;
          })
          .catch(() => this.deletingCheckpoint());
      })
      .catch(() => null);
  }

  deletingCheckpoint() {
    return this.retrievingCheckpoint()
      .then((preferences) =>
        this.ovhUserPref.remove(PREFERENCE_CHECKPOINT).then(() => preferences),
      )
      .then((preferences) => {
        if (
          !isObject(preferences) ||
          isEmpty(preferences) ||
          isEmpty(preferences[this.$routerParams.organization])
        ) {
          return null;
        }

        // eslint-disable-next-line no-param-reassign
        delete preferences[this.$routerParams.organization][this.domainName];

        if (isEmpty(preferences[this.$routerParams.organization])) {
          // eslint-disable-next-line no-param-reassign
          delete preferences[this.$routerParams.organization];
        }

        this.domainName = null;
        this.cnameToCheck = null;
        this.isAutoConfigurationMode = null;
        this.mxRelay = null;
        this.domainIsAssociatedToEmailService = null;
        this.domainIsNotManagedByCurrentNIC = null;
        this.domainIsOnlyForExchange = null;
        this.shouldDisplayFirstStep = true;
        this.shouldDisplaySummary = false;
        this.navigationState = '';
        this.domainHasBeenAssociated = false;
        this.shouldDisabledDomainSelection = false;
        this.isShowingEmailCustomization = false;

        if (isEmpty(preferences)) {
          return null;
        }

        return this.ovhUserPref.create(PREFERENCE_CHECKPOINT, preferences);
      });
  }
}
