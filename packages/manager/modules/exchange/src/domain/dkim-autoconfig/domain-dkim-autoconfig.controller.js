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
    this.DKIM_STATUS = navigation.currentActionData.constant.DKIM_STATUS;
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
    const showWhen = [
      this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED,
      this.GLOBAL_DKIM_STATUS.OK,
      this.GLOBAL_DKIM_STATUS.DISABLED,
    ];

    return this.domainDiag.isOvhDomain && showWhen.includes(this.dkimStatus);
  }

  onFinishDkim() {
    switch (this.dkimStatus) {
      case this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED:
        return this.configDkim();
      case this.GLOBAL_DKIM_STATUS.OK:
        return this.deactivateDkim();
      case this.GLOBAL_DKIM_STATUS.DISABLED:
        return this.activateDkim();
      default:
        console.error('Invalid DKIM status:', this.dkimStatus);
        return null;
    }
  }

  activateDkim() {
    const dkimSelectors = this.domain.dkim;

    this.services.ExchangeDomains.enableDkim(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
      dkimSelectors[0].selectorName,
    ).finally(() => {
      this.services.navigation.resetAction();
    });
  }

  deactivateDkim() {
    const dkimSelectors = this.domain.dkim;

    this.services.ExchangeDomains.disableDkim(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
      dkimSelectors[0].status === this.DKIM_STATUS.IN_PRODUCTION
        ? dkimSelectors[0].selectorName
        : dkimSelectors[1].selectorName,
    ).finally(() => {
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
