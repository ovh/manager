import { DKIM_CONFIGURATION_GUIDE } from './emailpro-domain-dkim-autoconfig.constants';

import DkimAutoConfigurator from './dkim-auto-configurator';

export default class EmailProDomainDkimAutoconfigCtrl extends DkimAutoConfigurator {
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
    super();
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

    this.dkimGuideLink =
      DKIM_CONFIGURATION_GUIDE[coreConfig.getUser().ovhSubsidiary] ||
      DKIM_CONFIGURATION_GUIDE.DEFAULT;

    this.init();
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

  getDkimSelectorForCurrentState() {
    return this.services.EmailProDomains.getDkimSelector(
      this.services.$stateParams.productId,
      this.domain.name,
    );
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
    this.stepConfigureDkim('emailpro');
  }

  getTitleDependingOnStep() {
    return this.getTitleDependingOnStep('emailpro');
  }

  getNextButtonDependingOnStep() {
    return this.getNextButtonDependingOnStep('emailpro');
  }

  getDkimName(index) {
    return this.getDkimNameFor('emailpro', index);
  }

  getDkimRecord(index) {
    return this.getDkimRecordFor('emailpro', index);
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
