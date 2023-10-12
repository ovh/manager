import { DKIM_CONFIGURATION_GUIDE } from './emailpro-domain-dkim-autoconfig.constants';

export default class EmailProDomainDkimAutoconfigCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    EmailProDomains,
    navigation,
    $translate,
    $stateParams,
    coreConfig,
  ) {
    this.services = {
      $q,
      $scope,
      EmailProDomains,
      navigation,
      $translate,
      $stateParams,
    };

    this.domain = $scope.currentActionData.domain;
    this.dkimStatus = $scope.currentActionData.dkimStatus;
    this.GLOBAL_DKIM_STATUS =
      $scope.currentActionData.constant.GLOBAL_DKIM_STATUS;
    this.services.$scope.configDkim = () => this.configDkim();

    // DKIM configurator methods for no Ovh Cloud
    $scope.loadDataForDkim = () => this.loadDataForDkim();
    $scope.getDkimSelector = () => this.getDkimSelector();
    $scope.leaveDkimConfigurator = () => this.leaveDkimConfigurator();
    $scope.getNextButtonDependingOnStep = () =>
      this.getNextButtonDependingOnStep();
    $scope.getTitleDependingOnStep = () => this.getTitleDependingOnStep();
    $scope.initSpfContext = () => this.initSpfContext();

    this.dkimGuideLink =
      DKIM_CONFIGURATION_GUIDE[coreConfig.getUser().ovhSubsidiary] ||
      DKIM_CONFIGURATION_GUIDE.DEFAULT;

    this.init();
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

  async getSelectorNameForNoOvhCloud() {
    if (!this.dkimSelectorsNoDomain) {
      return;
    }
    const promises = this.dkimSelectorsNoDomain.map((dkimSelector) => {
      return this.services.EmailProDomains.getDkimSelectorName(
        this.services.$stateParams.productId,
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
    return this.services.EmailProDomains.getDkimSelector(
      this.services.$stateParams.productId,
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
      return this.services.EmailProDomains.postDkim(
        this.services.$stateParams.productId,
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
            'emailpro_tab_domain_diagnostic_dkim_activation_success',
          ),
        );
      })
      .catch(() => {
        this.leaveDkimConfigurator();
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'emailpro_tab_domain_diagnostic_dkim_configurate_no_ovhcloud_failed',
          ),
        );
      });
  }

  getTitleDependingOnStep() {
    return !this.showSpfDiagnosticTitle
      ? 'emailpro_tab_domain_diagnostic_dkim_title_configuration'
      : 'emailpro_tab_domain_diagnostic_spf_title';
  }

  getNextButtonDependingOnStep() {
    return this.showConfiguratingBtn
      ? 'emailpro_tab_domain_diagnostic_dkim_configurate_no_ovhcloud'
      : 'emailpro_tab_domain_diagnostic_dkim_next_no_ovhcloud';
  }

  initSpfContext() {
    this.showSpfDiagnosticTitle = true;
    return this.getSelectorNameForNoOvhCloud();
  }

  getDkimName(index) {
    return [
      this.services.$translate.instant(
        'emailpro_tab_domain_diagnostic_dkim_name',
      ),
      `${index}: `,
      this[`selector${index}NoDomain`].customerRecord,
    ].join('');
  }

  getDkimRecord(index) {
    return [
      this.services.$translate.instant(
        'emailpro_tab_domain_diagnostic_dkim_record',
      ),
      `${index}: `,
      this[`selector${index}NoDomain`].targetRecord,
    ].join('');
  }

  init() {
    this.loading = true;

    // Vars for DKIM configuration inside modal stepper
    this.initializeDkimConfiguratorNoOvh();

    this.services.EmailProDomains.getDnsSettings(
      this.services.$stateParams.productId,
      this.domain.name,
    )
      .then(
        (data) => {
          this.domainDiag = data;
          this.hideConfirmButton = this.hideConfirmButton();
          this.dkimForNoOvhCloud =
            this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED &&
            !this.domainDiag.isOvhDomain;
          this.loading = false;
        },
        (failure) => {
          this.services.$scope.resetAction();
          this.services.$scope.setMessage(
            this.services.$translate.instant(
              'emailpro_tab_domain_diagnostic_add_field_failure',
            ),
            failure,
          );
        },
      )
      .finally(() => {
        this.loading.step1 = false;
      });
  }

  hideConfirmButton() {
    return (
      this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED &&
      this.domainDiag.isOvhDomain
    );
  }

  configDkim() {
    this.getDkimSelectorForCurrentState()
      .then((dkimSelectors) => {
        const promises = this.postDkimFor(dkimSelectors);
        return this.services.$q.all(promises);
      })
      .then(() => {
        this.services.$scope.setMessage(
          this.services.$translate.instant(
            'emailpro_tab_domain_diagnostic_dkim_activation_success',
          ),
          { status: 'success' },
        );
      })
      .catch(() => {
        this.services.$scope.setMessage(
          this.services.$translate.instant(
            'emailpro_tab_domain_diagnostic_dkim_activation_error',
          ),
          { status: 'error' },
        );
      })
      .finally(() => {
        this.services.$scope.resetAction();
      });
  }
}
