import { DKIM_CONFIGURATION_GUIDE } from './domain-dkim-autoconfig.constants';
import { STATUS_TO_TEXT_MAP } from '../domain.constants';
import DkimAutoConfigurator from './dkim-auto-configurator';

export default class ExchangeDomainDkimAutoconfigCtrl extends DkimAutoConfigurator {
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
    super();
    this.services = {
      $q,
      $scope,
      wucExchange,
      ExchangeDomains,
      navigation,
      messaging, // also used in parent class
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

    if (this.dkimStatus === this.GLOBAL_DKIM_STATUS.NOK) {
      this.services.ExchangeDomains.getDomain(
        this.$routerParams.organization,
        this.$routerParams.productId,
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

  getDkimSelectorForCurrentState() {
    return this.services.ExchangeDomains.getDkimSelector(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
    );
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
          configureDkim: !this.dkimForNoOvhCloud,
        },
      );
    });
  }

  stepConfigureDkim() {
    this.stepConfigureDkimFor('exchange');
  }

  getTitleDependingOnStep() {
    return this.getTitleDependingOnStepFor('exchange');
  }

  getNextButtonDependingOnStep() {
    return this.getNextButtonDependingOnStepFor('exchange');
  }

  getDkimName(index) {
    return this.getDkimNameFor('exchange', index);
  }

  getDkimRecord(index) {
    return this.getDkimRecordFor('exchange', index);
  }

  configDkim() {
    this.getDkimSelectorForCurrentState()
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

  getBodyText() {
    let translationKey;
    if (this.dkimStatus === this.DKIM_STATUS.NOT_CONFIGURED) {
      translationKey = this.domainDiag.isOvhDomain
        ? 'exchange_tab_domain_diagnostic_dkim_activation_ovhcloud'
        : 'exchange_tab_domain_diagnostic_dkim_activation_no_ovhcloud';
    } else {
      translationKey = STATUS_TO_TEXT_MAP[this.dkimStatus];
    }
    return translationKey;
  }
}
