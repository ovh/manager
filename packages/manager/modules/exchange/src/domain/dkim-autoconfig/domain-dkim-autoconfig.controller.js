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

    $scope.configDkim = () => this.configDkim();
  }

  hideConfirmButton() {
    return (
      this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED &&
      this.domainDiag.isOvhDomain
    );
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
