import {
  DKIM_CONFIGURATION_GUIDE,
  DKIM_CONFIGURATION_GUIDE_NO_OVH,
} from './emailpro-domain-dkim-autoconfig.constants';
import { DKIM_STATUS, DKIM_STATUS_TEXT } from '../emailpro-domain.constants';

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
    $state, // see DkimAutoConfigurator
  ) {
    super();
    this.services = {
      $q,
      $scope,
      EmailProDomains,
      navigation,
      $translate,
      $stateParams,
      $state,
    };

    this.serviceType = 'emailpro';
    this.domain = $scope.currentActionData.domain;
    this.DKIM_STATUS = DKIM_STATUS;
    this.dkimGuideLink =
      DKIM_CONFIGURATION_GUIDE[coreConfig.getUser().ovhSubsidiary] ||
      DKIM_CONFIGURATION_GUIDE.DEFAULT;
    this.dkimGuideLinkNoOvh =
      DKIM_CONFIGURATION_GUIDE_NO_OVH[coreConfig.getUser().ovhSubsidiary] ||
      DKIM_CONFIGURATION_GUIDE_NO_OVH.DEFAULT;

    this.init();
  }

  init() {
    this.loading = true;
    const {
      dkimDiag: { state, errorCode, message },
    } = this.domain;
    this.dkimStatus = state;
    if (state === DKIM_STATUS.ERROR) {
      this.dkimErrorMessage = message;
    }

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
            this.dkimStatus === DKIM_STATUS.TO_CONFIGURE &&
            !this.domainDiag.isOvhDomain;
          this.bodyText = this.getBodyText(
            state,
            this.dkimGuideLink,
            errorCode,
          );
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
      this.domainDiag.isOvhDomain &&
      [
        DKIM_STATUS.TO_CONFIGURE,
        DKIM_STATUS.ACTIVE,
        DKIM_STATUS.DISABLED,
      ].includes(this.dkimStatus)
    );
  }

  onFinishDkim() {
    switch (this.dkimStatus) {
      case DKIM_STATUS.TO_CONFIGURE:
        return this.configDkim();
      case DKIM_STATUS.ACTIVE:
        return this.deactivateDkim();
      case DKIM_STATUS.DISABLED:
        return this.activateDkim();
      default:
        console.error('Invalid DKIM status:', this.dkimStatus);
        return null;
    }
  }

  activateDkim() {
    const dkimSelectors = this.domain.dkim;

    const promise = this.services.EmailProDomains.enableDkim(
      this.services.$stateParams.productId,
      this.domain.name,
      dkimSelectors[0].selectorName,
    );

    this.handleDkimOperationResponse(promise);
  }

  deactivateDkim() {
    const dkimSelectors = this.domain.dkim;

    const promise = this.services.EmailProDomains.disableDkim(
      this.services.$stateParams.productId,
      this.domain.name,
      dkimSelectors[0].status === 'inProduction'
        ? dkimSelectors[0].selectorName
        : dkimSelectors[1].selectorName,
    );
    this.handleDkimOperationResponse(promise);
  }

  getDkimSelectorForCurrentState() {
    return this.services.EmailProDomains.getDkimSelector(
      this.services.$stateParams.productId,
      this.domain.name,
    ).catch(({ data }) => {
      this.writeError('emailpro_tab_domain_diagnostic_dkim_error', data);
      this.leaveDkimConfigurator();
      return this.services.$q.reject(data);
    });
  }

  postDkim(selectors) {
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

  configDkim() {
    const promise = this.getDkimSelectorForCurrentState();
    promise.then((dkimSelectors) => {
      const promises = this.postDkim(dkimSelectors);
      return this.services.$q.all(promises);
    });
    this.handleDkimOperationResponse(promise);
  }

  handleDkimOperationResponse(promise) {
    let reload = false;
    promise
      .then(() => {
        reload = true;
        this.writeSuccess(
          'emailpro_tab_domain_diagnostic_dkim_activation_success',
        );
      })
      .catch(({ data }) => {
        this.writeError('emailpro_tab_domain_diagnostic_dkim_error', data);
      })
      .finally(() => {
        this.leaveDkimConfigurator(reload);
      });
  }

  getBodyText(status, url, errorCode) {
    let translationKey;
    if (status === DKIM_STATUS.TO_CONFIGURE) {
      translationKey = this.domainDiag.isOvhDomain
        ? 'emailpro_tab_domain_diagnostic_dkim_activation_ovhcloud'
        : 'emailpro_tab_domain_diagnostic_dkim_activation_no_ovhcloud';
    } else {
      translationKey = DKIM_STATUS_TEXT[status];
    }
    return translationKey
      ? this.services.$translate.instant(translationKey, {
          url,
          errorCode,
        })
      : '';
  }

  getTitleForWizard() {
    const titleKey =
      DKIM_STATUS.DISABLED === this.dkimStatus ? 'activation' : 'error';
    return this.services.$translate.instant(
      `emailpro_tab_domain_diagnostic_dkim_title_${titleKey}`,
    );
  }
}
