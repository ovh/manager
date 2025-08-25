import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import set from 'lodash/set';

import { EXCHANGE_CONTAINER_MESSAGING } from './exchange.constants';
import { FEATURES } from '../exchange.constants';

export default class ExchangeCtrl {
  /* @ngInject */
  constructor(
    $q,
    $location,
    $rootScope,
    $scope,
    $timeout,
    $translate,
    accountLink,
    currentActiveLink,
    diagnosticLink,
    disclaimerLink,
    domainLink,
    wucExchange,
    exchangeServiceInfrastructure,
    exchangeVersion,
    externalContactLink,
    groupLink,
    informationLink,
    messaging,
    navigation,
    ovhUserPref,
    organization,
    productId,
    exchange,
    reloadDashboard,
    WucUser,
    resourceLink,
    securityLink,
    sharedLink,
    sharedAccountLink,
    taskLink,
    logsLink,
    features,
  ) {
    this.services = {
      $q,
      $location,
      $rootScope,
      $scope,
      $timeout,
      $translate,
      wucExchange,
      exchangeServiceInfrastructure,
      exchangeVersion,
      messaging,
      navigation,
      ovhUserPref,
      organization,
      productId,
      exchange,
      reloadDashboard,
      WucUser,
    };
    this.exchange = exchange;
    this.$routerParams = wucExchange.getParams();

    this.EXCHANGE_CONTAINER_MESSAGING = EXCHANGE_CONTAINER_MESSAGING;

    set(navigation, '$exchangeRootScope', $scope);
    set(messaging, '$exchangeRootScope', $scope);

    $scope.resetAction = navigation.resetAction.bind(navigation);
    $scope.setAction = navigation.setAction.bind(navigation);
    $scope.resetMessages = messaging.resetMessages.bind(messaging);
    $scope.setMessage = messaging.setMessage.bind(messaging);

    this.isLoading = true;
    this.hasNoDomain = false;
    this.loadingExchangeError = false;

    this.currentAction = null;
    this.currentActionData = null;
    this.displayGuides = null;
    this.displayName = null;

    $scope.$on('exchange.dashboard.refresh', () => {
      reloadDashboard();
    });

    $scope.$on('exchange.wizard_hosted_creation.display', () => {
      this.shouldOpenWizard = this.services.exchangeServiceInfrastructure.isHosted();
      this.hasNoDomain = true;
    });

    $scope.$on('exchange.wizard_hosted_creation.hide', () => {
      this.shouldOpenWizard = false;
      this.hasNoDomain = false;
    });

    this.currentActiveLink = currentActiveLink;
    this.informationLink = informationLink;
    this.domainLink = domainLink;
    this.accountLink = accountLink;
    this.groupLink = groupLink;
    this.externalContactLink = externalContactLink;
    this.sharedAccountLink = sharedAccountLink;
    this.diagnosticLink = diagnosticLink;
    this.securityLink = securityLink;
    this.resourceLink = resourceLink;
    this.disclaimerLink = disclaimerLink;
    this.sharedLink = sharedLink;
    this.taskLink = taskLink;
    this.logsLink = logsLink;
    this.features = features;
  }

  $onInit() {
    this.services.wucExchange.value = this.exchange;
    if (!isEmpty(this.exchange.messages)) {
      this.services.messaging.writeError(
        this.services.$translate.instant('exchange_dashboard_loading_error'),
        this.exchange,
      );
    }
    this.services.$scope.resetMessages();

    const modals = {
      billing: 'exchange/header/update-renew/update-renew',
      resiliate: 'exchange/header/remove/exchange-remove',
    };

    this.retrievingWizardPreference().then(() => {
      const urlParamAction = this.services.$location.search().action;
      if (Object.keys(modals).includes(urlParamAction)) {
        this.services.$timeout(() => {
          this.services.$rootScope.$broadcast(
            'leftNavigation.selectProduct.fromName',
            this.parseLocationForExchangeData(),
          );
          this.services.$scope.setAction(
            modals[urlParamAction],
            this.parseLocationForExchangeData(),
          );
        });
      }
    });
    this.isLogsAvailable = this.features.isFeatureAvailable(FEATURES.LOGS);
    this.BETA = 'Beta';
  }

  retrievingWizardPreference() {
    this.isLoading = true;
    this.shouldOpenWizard = this.services.exchangeServiceInfrastructure.isHosted();

    if (!this.shouldOpenWizard) {
      this.isLoading = false;
      return this.services.$q.when(false);
    }

    return this.services.wucExchange
      .retrievingWizardPreference()
      .then((preference) => {
        this.shouldOpenWizard = get(preference, 'shouldOpenWizard', false);
      })
      .catch(() => {
        this.shouldOpenWizard = true;
      })
      .then(() =>
        this.services.WucUser.getUser().then((currentUser) => {
          const { ovhSubsidiary } = currentUser;

          this.shouldOpenWizard =
            this.shouldOpenWizard && ovhSubsidiary !== 'CA';
        }),
      )
      .then(() => {
        if (this.shouldOpenWizard) {
          return this.services.ovhUserPref
            .getValue('WIZARD_HOSTED_CREATION_CHECKPOINT')
            .catch(() => null)
            .then((preferences) => {
              const preferenceToSave =
                !isObject(preferences) || isEmpty(preferences)
                  ? {}
                  : preferences;

              const hasNoDomain = this.exchange.domainsNumber === 0;
              const isReturningToWizard = !isEmpty(
                preferenceToSave[this.$routerParams.organization],
              );

              this.hasNoDomain =
                hasNoDomain || (!hasNoDomain && isReturningToWizard);
            });
        }

        return null;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  parseLocationForExchangeData() {
    // expect something like
    // /configuration/exchange_dedicated/organization-ID/exchange-ID?action=billing&tab=DOMAINS"
    // extract "exchange_dedicated"
    const locationSplit = this.services.$location
      .url()
      .replace('/configuration/', '')
      .split('/');
    const type = locationSplit[0].toUpperCase();

    return {
      name: this.$routerParams.productId,
      organization: this.$routerParams.organization,
      type,
    };
  }
}
