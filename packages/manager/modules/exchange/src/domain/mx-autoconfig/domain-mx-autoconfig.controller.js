export default class ExchangeDomainMxAutoconfigCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangeDomains,
    EXCHANGE_MX_CONFIG,
    coreConfig,
    messaging,
    navigation,
    $translate,
    exchangeStates,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangeDomains,
      EXCHANGE_MX_CONFIG,
      coreConfig,
      messaging,
      navigation,
      $translate,
      exchangeStates,
    };

    this.$routerParams = wucExchange.getParams();
    this.domain = navigation.currentActionData;

    this.services.ExchangeDomains.gettingDNSSettings(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
    )
      .then((data) => {
        this.domainDiag = data;

        if (coreConfig.isRegion('EU')) {
          this.domainDiag.mx.spam = EXCHANGE_MX_CONFIG.EU.spam;
        } else if (coreConfig.isRegion('CA')) {
          this.domainDiag.mx.spam = EXCHANGE_MX_CONFIG.CA.spam;
        }

        if (this.domainDiag.isOvhDomain) {
          this.model = {
            antiSpam: false,
          };
        }
      })
      .catch((failure) => {
        navigation.resetAction();
        messaging.writeError(
          $translate.instant(
            'exchange_tab_domain_diagnostic_add_field_failure',
          ),
          failure,
        );
      });

    $scope.configMX = () => this.configMX();
  }

  prepareModel() {
    let data = this.domainDiag.mx.noSpam;

    if (this.model.antiSpam) {
      data = this.domainDiag.mx.spam;
    }

    return {
      domain: this.domain.name,
      fieldList: data,
    };
  }

  configMX() {
    this.services.ExchangeDomains.addingZoneDnsField(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.prepareModel(),
    )
      .then((data) => {
        if (this.services.exchangeStates.constructor.isOk(data)) {
          this.services.messaging.writeSuccess(
            this.services.$translate.instant(
              'exchange_tab_domain_diagnostic_add_field_success',
            ),
          );
        } else {
          this.services.messaging.writeError(
            this.services.$translate.instant(
              'exchange_tab_domain_diagnostic_add_field_failure',
            ),
            data,
          );
        }
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_domain_diagnostic_add_field_failure',
          ),
          {
            code: this.domain.name,
            message: failure.message,
          },
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
