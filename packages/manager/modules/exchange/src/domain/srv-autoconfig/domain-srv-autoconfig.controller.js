export default class ExchangeDomainSrvAutoconfigCtrl {
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
        const re = /^([^ ]*) IN ([A-Z]*) (\d+) (\d+) (\d+) ([^ ]*)$/i;
        const extract = data.expectedAutodiscoverSRV.match(re);

        this.domainDiag.srv = {
          fieldType: extract[2],
          target: extract[6],
          priority: extract[3],
          weight: extract[4],
          port: extract[5],
          subDomain: extract[1],
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

    $scope.configSRV = () => this.configSRV();
  }

  configSRV() {
    this.services.ExchangeDomains.addingZoneDnsField(
      this.$routerParams.organization,
      this.$routerParams.productId,
      {
        domain: this.domain.name,
        fieldList: [this.domainDiag.srv],
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
