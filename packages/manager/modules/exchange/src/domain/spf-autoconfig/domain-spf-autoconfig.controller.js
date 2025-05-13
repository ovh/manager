export default class ExchangeDomainSpfAutoconfigCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangeDomains,
    navigation,
    messaging,
    $translate,
    exchangeStates,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangeDomains,
      navigation,
      messaging,
      $translate,
      exchangeStates,
    };

    this.$routerParams = wucExchange.getParams();
    this.domain = navigation.currentActionData;
    this.domainDiag = {};

    this.services.ExchangeDomains.gettingDNSSettings(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
    )
      .then((data) => {
        this.domainDiag.isOvhDomain = data.isOvhDomain;
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

    this.services.ExchangeDomains.gettingExpectedDNSSettings(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
    )
      .then((data) => {
        const re = /^IN ([A-Z]*) (v=spf.*all)/i;
        const extract = data.expectedSPF.match(re);

        this.domainDiag.spf = {
          fieldType: 'SPF',
          target: `"${extract[2]}"`,
          priority: 0,
          weight: 0,
          port: null,
          subDomain: null,
        };
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

    $scope.configSPF = () => this.configSPF();
  }

  configSPF() {
    this.services.ExchangeDomains.addingZoneDnsField(
      this.$routerParams.organization,
      this.$routerParams.productId,
      {
        domain: this.domain.name,
        fieldList: [this.domainDiag.spf],
      },
    )
      .then((success) => {
        if (this.services.exchangeStates.constructor.isOk(success)) {
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
          );
        }
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_domain_diagnostic_add_field_failure',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
