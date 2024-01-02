import {
  DKIM_CONFIGURATION_GUIDE,
  DKIM_CONFIGURATION_GUIDE_NO_OVH,
} from './domain-dkim-autoconfig.constants';
import { DKIM_STATUS, DKIM_STATUS_TEXT } from '../domain.constants';
import DkimAutoConfigurator from './dkim-auto-configurator';

export default class ExchangeDomainDkimAutoconfigCtrl extends DkimAutoConfigurator {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $scope,
    wucExchange,
    ExchangeDomains,
    navigation,
    messaging,
    $translate,
    exchangeStates,
    coreConfig,
  ) {
    super();
    this.services = {
      $q,
      $state,
      $scope,
      wucExchange,
      ExchangeDomains,
      navigation,
      messaging, // also used in parent class
      $translate,
      exchangeStates,
    };

    this.serviceType = 'exchange';
    this.loading = true;
    this.$routerParams = wucExchange.getParams();
    this.domain = navigation.currentActionData.domain;
    const {
      dkimDiagnostics: { state, errorCode, message },
    } = this.domain;
    this.dkimStatus = state;
    if (state === DKIM_STATUS.ERROR) {
      this.dkimErrorMessage = message;
    }
    this.DKIM_STATUS = DKIM_STATUS;
    this.dkimGuideLink =
      DKIM_CONFIGURATION_GUIDE[coreConfig.getUser().ovhSubsidiary] ||
      DKIM_CONFIGURATION_GUIDE.DEFAULT;
    this.dkimGuideLinkNoOvh =
      DKIM_CONFIGURATION_GUIDE_NO_OVH[coreConfig.getUser().ovhSubsidiary] ||
      DKIM_CONFIGURATION_GUIDE_NO_OVH.DEFAULT;

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
          this.dkimStatus === this.DKIM_STATUS.TO_CONFIGURE &&
          !this.domainDiag.isOvhDomain;

        this.bodyText = this.getBodyText(state, this.dkimGuideLink, errorCode);

        this.loading = false;
      })
      .catch((failure) => {
        this.services.navigation.resetAction();
        this.messaging.writeError(
          this.$translate.instant(
            'exchange_tab_domain_diagnostic_add_field_failure',
          ),
          failure,
        );
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

    const promise = this.services.ExchangeDomains.enableDkim(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
      dkimSelectors[0].selectorName,
    );
    this.handleDkimOperationResponse(promise);
  }

  deactivateDkim() {
    const dkimSelectors = this.domain.dkim;

    const promise = this.services.ExchangeDomains.disableDkim(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
      dkimSelectors[0].status === 'inProduction'
        ? dkimSelectors[0].selectorName
        : dkimSelectors[1].selectorName,
    );
    this.handleDkimOperationResponse(promise);
  }

  resetAction(reload = false) {
    this.services.navigation.resetAction();
    this.services.$state.go(
      'exchange.dashboard.domain',
      {},
      reload ? { reload: 'exchange.dashboard.domain' } : null,
    );
  }

  getDkimSelectorForCurrentState() {
    return this.services.ExchangeDomains.getDkimSelector(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
    );
  }

  postDkim(selectors) {
    return selectors.map((dkimSelector, index) => {
      return this.services.ExchangeDomains.postDkim(
        this.$routerParams.organization,
        this.$routerParams.productId,
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
    const promise = this.getDkimSelectorForCurrentState().then(
      (dkimSelectors) => {
        const promises = this.postDkim(dkimSelectors);
        return this.services.$q.all(promises);
      },
    );
    this.handleDkimOperationResponse(promise);
  }

  handleDkimOperationResponse(promise) {
    let reload = false;
    promise
      .then(() => {
        reload = true;
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
        this.resetAction(reload);
      });
  }

  getBodyText(state, url, errorCode) {
    let translationKey;
    if (state === this.DKIM_STATUS.TO_CONFIGURE) {
      translationKey = this.domainDiag.isOvhDomain
        ? 'exchange_tab_domain_diagnostic_dkim_activation_ovhcloud'
        : 'exchange_tab_domain_diagnostic_dkim_activation_no_ovhcloud';
    } else {
      translationKey = DKIM_STATUS_TEXT[state];
    }
    return translationKey
      ? this.services.$translate.instant(translationKey, {
          url,
          errorCode,
        })
      : '';
  }
}
