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

    // Vars for DKIM configuration inside modal stepper
    this.initializeDkimConfiguratorNoOvh();

    this.services.ExchangeDomains.gettingDNSSettings(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
    )
      .then((data) => {
        this.domainDiag = data;

        this.hideConfirmButton = this.hideConfirmButton();

        this.dkimForNoOvhCloud =
          this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED &&
          !this.domainDiag.isOvhDomain;

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

    // DKIM configurator methods for no Ovh Cloud
    $scope.loadDataForDkim = () => this.loadDataForDkim();
    $scope.getDkimSelector = () => this.getDkimSelector();
    $scope.leaveDkimConfigurator = () => this.leaveDkimConfigurator();
    $scope.getNextButtonDependingOnStep = () =>
      this.getNextButtonDependingOnStep();
    $scope.getTitleDependingOnStep = () => this.getTitleDependingOnStep();
    $scope.initSpfContext = () => this.initSpfContext();
  }

  initializeDkimConfiguratorNoOvh() {
    this.selector1NameInfos = '';
    this.selector1RecordInfos = '';
    this.selector2NameInfos = '';
    this.selector2RecordInfos = '';
    this.dkimSelectorsNoDomain = null;
    this.selector1NoDomain = null;
    this.selector2NoDomain = null;
    this.isStepConfigureValid = false;
    this.showConfiguratingBtn = true;
    this.showSpfDiagnosticTitle = false;
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

  async getSelectorNameForNoOvhCloud() {
    if (!this.dkimSelectorsNoDomain) {
      return;
    }
    const promises = this.dkimSelectorsNoDomain.map((dkimSelector) => {
      return this.services.ExchangeDomains.getDkimSelectorName(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.domain.name,
        dkimSelector,
      );
    });

    const [selector1NoDomain, selector2NoDomain] = await this.services.$q.all(
      promises,
    );
    this.selector1NoDomain = selector1NoDomain;
    this.selector1NameInfos = this.getDkimName(1);
    this.selector1RecordInfos = this.getDkimRecord(1);
    this.selector2NoDomain = selector2NoDomain;
    this.selector2NameInfos = this.getDkimName(2);
    this.selector2RecordInfos = this.getDkimRecord(2);
  }

  async loadDataForDkim() {
    this.showConfiguratingBtn = false;
    this.showSpfDiagnosticTitle = false;
    this.loading = true;
    await this.stepConfigureDkim();
    this.isStepConfigureValid = true;
    this.loading = false;
  }

  getDkimSelectorForCurrentState() {
    return this.services.ExchangeDomains.getDkimSelector(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
    );
  }

  getDkimSelector() {
    return this.getDkimSelectorForCurrentState().then((dkimSelectors) => {
      this.dkimSelectorsNoDomain = dkimSelectors;
    });
  }

  leaveDkimConfigurator() {
    this.services.navigation.resetAction();
    return this.initializeDkimConfiguratorNoOvh();
  }

  postDkimFor(selectors) {
    return selectors.map((dkimSelector, index) => {
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
  }

  stepConfigureDkim() {
    const promises = this.postDkimFor(this.dkimSelectorsNoDomain);
    return this.services.$q
      .all(promises)
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_domain_diagnostic_dkim_activation_success',
          ),
        );
      })
      .catch(() => {
        this.leaveDkimConfigurator();
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_domain_diagnostic_dkim_configurate_no_ovhcloud_failed',
          ),
        );
      });
  }

  initSpfContext() {
    this.showSpfDiagnosticTitle = true;
    return this.getSelectorNameForNoOvhCloud();
  }

  getTitleDependingOnStep() {
    return this.showSpfDiagnosticTitle
      ? 'exchange_tab_domain_diagnostic_dkim_configurate_no_ovhcloud'
      : 'exchange_tab_domain_diagnostic_dkim_next_no_ovhcloud';
  }

  getNextButtonDependingOnStep() {
    return this.showConfiguratingBtn
      ? 'exchange_tab_domain_diagnostic_dkim_title_configuration'
      : 'exchange_tab_domain_diagnostic_spf_title';
  }

  getDkimName(index) {
    return [
      this.services.$translate.instant(
        'exchange_tab_domain_diagnostic_dkim_name',
      ),
      `${index}: `,
      this[`selector${index}NoDomain`].customerRecord,
    ].join('');
  }

  getDkimRecord(index) {
    return [
      this.services.$translate.instant(
        'exchange_tab_domain_diagnostic_dkim_record',
      ),
      `${index}: `,
      this[`selector${index}NoDomain`].targetRecord,
    ].join('');
  }

  configDkim() {
    this.this
      .getDkimSelectorForCurrentState()
      .then((dkimSelectors) => {
        const promises = this.postDkimFor(dkimSelectors);
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
