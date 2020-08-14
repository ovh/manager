import clone from 'lodash/clone';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import set from 'lodash/set';

export default class ExchangeServicesConfigureCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    APIExchange,
    wucExchange,
    coreConfig,
    exchangeSelectedService,
    navigation,
    messaging,
  ) {
    this.$q = $q;
    this.services = {
      $scope,
      APIExchange,
      $translate,
      wucExchange,
      coreConfig,
      exchangeSelectedService,
      navigation,
      messaging,
    };

    this.exchange = wucExchange.value;

    this.loaders = {
      details: true,
      put: false,
    };

    this.service = {};
  }

  $onInit() {
    return this.retrievingDetails();
  }

  retrievingDetails() {
    return this.$q
      .all({
        serviceDescription: this.services.APIExchange.get(
          '/{organizationName}/service/{exchangeService}',
          {
            urlParams: {
              organizationName: this.exchange.organization,
              exchangeService: this.exchange.domain,
            },
          },
        ),
        server: this.services.wucExchange.getExchangeServer(
          this.exchange.organization,
          this.exchange.domain,
        ),
      })
      .then(({ serviceDescription, server }) => {
        this.service = serviceDescription;

        this.service.lockoutThreshold = isNumber(this.service.lockoutThreshold)
          ? this.service.lockoutThreshold
          : 0;
        this.service.minPasswordLength = isNumber(
          this.service.minPasswordLength,
        )
          ? this.service.minPasswordLength
          : 0;
        this.service.minPasswordAge = isNumber(this.service.minPasswordAge)
          ? this.service.minPasswordAge
          : 0;
        this.service.maxPasswordAge = isNumber(this.service.maxPasswordAge)
          ? this.service.maxPasswordAge
          : 0;
        this.service.passwordHistoryCount = isNumber(
          this.service.passwordHistoryCount,
        )
          ? this.service.passwordHistoryCount
          : 0;

        this.originalService = clone(this.service);
        this.owaMfa = server.owaMfa;
        this.isMfaAvailable =
          this.services.coreConfig.isRegion('EU') &&
          this.services.exchangeSelectedService.isMfaAvailable();
        return this.service;
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_common_error'),
          err,
        );
      })
      .finally(() => {
        this.loaders.details = false;
      });
  }

  resetValues() {
    this.service = clone(this.originalService);
  }

  submitting() {
    this.loaders.put = true;

    const dataToSend = {
      complexityEnabled: this.service.complexityEnabled,
      lockoutThreshold: this.service.lockoutThreshold || null,
      maxPasswordAge: this.service.maxPasswordAge || null,
      minPasswordAge: this.service.minPasswordAge || null,
      passwordHistoryCount:
        this.service.maxPasswordAge > 0
          ? this.service.passwordHistoryCount || null
          : null,
      minPasswordLength: this.service.minPasswordLength || null,
      spamAndVirusConfiguration: this.service.spamAndVirusConfiguration,
    };

    if (this.service.lockoutThreshold > 0) {
      dataToSend.lockoutDuration = this.service.lockoutDuration;
      dataToSend.lockoutObservationWindow = this.service.lockoutObservationWindow;
    }
    return this.$q
      .all({
        configuration: this.services.wucExchange.setConfiguration(
          this.exchange.organization,
          this.exchange.domain,
          dataToSend,
        ),
        owaMfa:
          this.owaMfa === get(this.exchange, 'serverDiagnostic.owaMfa')
            ? this.$q.when(true)
            : this.services.wucExchange.updateExchangeServer(
                this.exchange.organization,
                this.exchange.domain,
                { owaMfa: this.owaMfa },
              ),
      })
      .then(() => {
        set(this.exchange, 'serverDiagnostic.owaMfa', this.owaMfa);
        this.services.wucExchange.resetAccounts();
        this.services.messaging.writeSuccess(
          this.services.$translate.instant('exchange_ACTION_configure_success'),
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_ACTION_configure_error', {
            error: failure.message,
          }),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
        this.loaders.put = false;
      });
  }
}
