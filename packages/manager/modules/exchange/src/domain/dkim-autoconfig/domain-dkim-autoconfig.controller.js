import { DKIM_CONFIGURATION_GUIDE } from './domain-dkim-autoconfig.constants';

export default class ExchangeDomainDkimAutoconfigCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    wucExchange,
    ExchangeDomains,
    navigation,
    messaging,
    $translate,
    exchangeStates,
    coreConfig,
  ) {
    this.services = {
      $q,
      $scope,
      wucExchange,
      ExchangeDomains,
      navigation,
      messaging,
      $translate,
      exchangeStates,
    };

    this.$routerParams = wucExchange.getParams();
    this.domain = navigation.currentActionData.domain;
    this.dkimStatus = navigation.currentActionData.dkimStatus;
    this.GLOBAL_DKIM_STATUS =
      navigation.currentActionData.constant.GLOBAL_DKIM_STATUS;

    this.dkimGuideLink =
      DKIM_CONFIGURATION_GUIDE[coreConfig.getUser().ovhSubsidiary] ||
      DKIM_CONFIGURATION_GUIDE.DEFAULT;

    this.loading = true;

    this.services.ExchangeDomains.gettingDNSSettings(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
    )
      .then((data) => {
        this.domainDiag = data;

        this.hideConfirmButton = this.hideConfirmButton();

        this.loading = false;
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

    $scope.onFinishDkim = () => this.onFinishDkim();
  }

  hideConfirmButton() {
    return (
      this.domainDiag.isOvhDomain &&
      (this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED ||
        this.dkimStatus === this.GLOBAL_DKIM_STATUS.OK)
    );
  }

  onFinishDkim() {
    if (this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED) {
      this.configDkim();
    } else if (this.dkimStatus === this.GLOBAL_DKIM_STATUS.OK) {
      this.deactivateDkim();
    }
  }

  deactivateDkim() {
    this.services.ExchangeDomains.getDkimSelector(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
    )
      .then((dkimSelectors) => {
        if (!dkimSelectors || dkimSelectors.length < 2) {
          throw new Error('Expected at least two dkimSelectors.');
        }

        Promise.all([
          this.services.ExchangeDomains.getDkimSelectorName(
            this.$routerParams.organization,
            this.$routerParams.productId,
            this.domain.name,
            dkimSelectors[0],
          ),
          this.services.ExchangeDomains.getDkimSelectorName(
            this.$routerParams.organization,
            this.$routerParams.productId,
            this.domain.name,
            dkimSelectors[1],
          ),
        ]).then((selectors) => {
          return this.services.ExchangeDomains.disableDkim(
            this.$routerParams.organization,
            this.$routerParams.productId,
            this.domain.name,
            selectors[0].status === 'inProduction'
              ? dkimSelectors[0]
              : dkimSelectors[1],
          );
        });
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }

  configDkim() {
    this.services.ExchangeDomains.getDkimSelector(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
    )
      .then((dkimSelectors) => {
        const promises = dkimSelectors.map((dkimSelector, index) => {
          return this.services.ExchangeDomains.postDkim(
            this.$routerParams.organization,
            this.$routerParams.productId,
            this.domain.name,
            {
              selectorName: dkimSelector,
              autoEnableDKIM: index === 0,
              configureDkim: true,
            },
          );
        });
        return this.services.$q.all(promises);
      })
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_domain_diagnostic_dkim_activation_success',
          ),
        );
      })
      .catch(() => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_domain_diagnostic_dkim_activation_error',
          ),
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
