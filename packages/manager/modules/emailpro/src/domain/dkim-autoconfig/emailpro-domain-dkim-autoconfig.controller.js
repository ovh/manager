import { DKIM_CONFIGURATION_GUIDE } from './emailpro-domain-dkim-autoconfig.constants';
import { STATUS_TO_TEXT_MAP } from '../emailpro-domain.constants';

import DkimAutoConfigurator from './dkim-auto-configurator';

export default class EmailProDomainDkimAutoconfigCtrl extends DkimAutoConfigurator {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    EmailProDomains,
    navigation,
    messaging,
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
      messaging, // used in parent class
      $translate,
      $stateParams,
    };

    this.domain = $scope.currentActionData.domain;
    this.dkimStatus = $scope.currentActionData.dkimStatus;
    this.GLOBAL_DKIM_STATUS =
      $scope.currentActionData.constant.GLOBAL_DKIM_STATUS;
    this.DKIM_STATUS = $scope.currentActionData.constant.DKIM_STATUS;
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

    if (this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOK) {
      this.services.EmailProDomains.getDomain(
        this.services.$stateParams.productId,
        this.domain.name,
      ).then((domain) => {
        this.dkimErrorCode = domain.dkimDiagnostics.errorCode;
      });
    }
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

    this.services.EmailProDomains.enableDkim(
      this.services.$stateParams.productId,
      this.domain.name,
      dkimSelectors[0].selectorName,
    ).finally(() => {
      this.services.$scope.resetAction();
    });
  }

  deactivateDkim() {
    const dkimSelectors = this.domain.dkim;

    this.services.EmailProDomains.disableDkim(
      this.services.$stateParams.productId,
      this.domain.name,
      dkimSelectors[0].status === this.DKIM_STATUS.IN_PRODUCTION
        ? dkimSelectors[0].selectorName
        : dkimSelectors[1].selectorName,
    ).finally(() => {
      this.services.$scope.resetAction();
    });
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
          configureDkim: !this.dkimForNoOvhCloud,
        },
      );
    });
  }

  stepConfigureDkim() {
    this.stepConfigureDkimFor('emailpro');
  }

  getTitleDependingOnStep() {
    return this.getTitleDependingOnStepFor('emailpro');
  }

  getNextButtonDependingOnStep() {
    return this.getNextButtonDependingOnStepFor('emailpro');
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

  getBodyText(status) {
    let translationKey;
    if (status === this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED) {
      translationKey = this.domainDiag.isOvhDomain
        ? 'emailpro_tab_domain_diagnostic_dkim_activation_ovhcloud'
        : 'emailpro_tab_domain_diagnostic_dkim_activation_no_ovhcloud';
    } else {
      translationKey = STATUS_TO_TEXT_MAP[status];
    }
    return translationKey
      ? this.services.$translate.instant(translationKey)
      : '';
  }

  getTitleForWizard() {
    if (
      this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOK ||
      this.dkimStatus === this.GLOBAL_DKIM_STATUS.OK
    ) {
      return this.services.$translate.instant(
        'emailpro_tab_domain_diagnostic_dkim_title_error',
      );
    }
    return this.services.$translate.instant(
      'emailpro_tab_domain_diagnostic_dkim_title_activation',
    );
  }
}
