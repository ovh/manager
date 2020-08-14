import camelCase from 'lodash/camelCase';
import cloneDeep from 'lodash/cloneDeep';

export default class ExchangeUpdateDomainCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    $rootScope,
    ExchangeDomains,
    WucValidator,
    navigation,
    messaging,
    $translate,
    exchangeVersion,
    exchangeServiceInfrastructure,
  ) {
    this.services = {
      $scope,
      wucExchange,
      $rootScope,
      ExchangeDomains,
      WucValidator,
      navigation,
      messaging,
      $translate,
      exchangeVersion,
      exchangeServiceInfrastructure,
    };

    this.$routerParams = wucExchange.getParams();
    this.originalValue = cloneDeep(navigation.currentActionData);

    this.selectedDomain = {
      name: navigation.currentActionData.name,
      type: navigation.currentActionData.type,
      mxRelay: navigation.currentActionData.mxRelay,
    };

    this.domainTypes = navigation.currentActionData.domainTypes;
    this.exchange = wucExchange.value;

    $scope.cancel = () => this.cancel();
    $scope.submit = () => this.submit();
    $scope.isValid = () => this.isValid();

    this.nonAuthoritativeEmail = [
      'mx0.mail.ovh.net',
      'mx1.mail.ovh.net',
      'mx2.mail.ovh.net',
      'mx3.mail.ovh.net',
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  removeTrailingDot(mxRelay) {
    if (mxRelay == null) {
      return mxRelay;
    }

    return mxRelay.replace(/\.$/, '');
  }

  cancel() {
    // Make sure the type in the select widget is reset to its initial value
    this.services.$rootScope.$broadcast(
      this.services.wucExchange.events.domainsChanged,
    );
    this.services.navigation.resetAction();
  }

  checkMxRelay() {
    if (
      this.selectedDomain.type === 'AUTHORITATIVE' &&
      this.selectedDomain.mxRelay != null
    ) {
      this.mxRelayBuffer = this.selectedDomain.mxRelay;
      this.selectedDomain.mxRelay = null;
    }

    if (
      this.selectedDomain.type === 'NON_AUTHORITATIVE' &&
      this.mxRelayBuffer != null
    ) {
      this.selectedDomain.mxRelay = this.mxRelayBuffer;
      this.mxRelayBuffer = null;
    }
  }

  /**
   * Hide mxRelay option for 2010 providers
   * @returns {boolean}
   */
  isMxRelayVisible() {
    return (
      !this.services.exchangeServiceInfrastructure.isProvider() ||
      !this.services.exchangeVersion.isVersion(2010)
    );
  }

  /**
   * Check for infinite loop condition (redirection towards its own hostname)
   * @returns {boolean} True if infinite loop condition detected
   */
  checkLoopWarning() {
    const hostName = this.exchange.hostname;
    return (
      hostName === this.selectedDomain.mxRelay ||
      `${hostName}.` === this.selectedDomain.mxRelay
    );
  }

  /**
   * Check if a domain have more than 255 characters
   * @returns {boolean} True if more than 255 characters
   */
  checkLengthWarning() {
    return (
      this.selectedDomain.mxRelay && this.selectedDomain.mxRelay.length > 255
    );
  }

  isValid() {
    const isAuthoritative = this.selectedDomain.type === 'AUTHORITATIVE';

    if (isAuthoritative) {
      return true;
    }

    const valueHasntChanged =
      this.originalValue.type === this.selectedDomain.type &&
      this.originalValue.mxRelay === this.selectedDomain.mxRelay;

    if (valueHasntChanged) {
      return false;
    }

    if (this.isMxRelayVisible()) {
      return (
        this.selectedDomain.mxRelay &&
        !this.checkLengthWarning() &&
        !this.checkLoopWarning() &&
        this.isValidMxRelay(this.selectedDomain.mxRelay)
      );
    }

    return true;
  }

  isValidMxRelay() {
    const mxRelayBuffer = this.removeTrailingDot(this.selectedDomain.mxRelay);

    return this.services.WucValidator.isValidDomain(mxRelayBuffer);
  }

  submit() {
    if (this.selectedDomain.type === 'AUTHORITATIVE') {
      this.selectedDomain.mxRelay = null;
    } else {
      this.selectedDomain.mxRelay = this.removeTrailingDot(
        this.selectedDomain.mxRelay,
      );
    }

    const data = {
      type: camelCase(this.selectedDomain.type),
      mxRelay: this.selectedDomain.mxRelay,
    };

    this.services.ExchangeDomains.updatingDomain(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.selectedDomain.name,
      data,
    )
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_domain_modify_success',
          ),
          'true',
        );
      })
      .catch((failure) => {
        // Make sure the type in the select widget is reset to its initial value
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_domain_modify_failure',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.$rootScope.$broadcast(
          this.services.wucExchange.events.domainsChanged,
        );
        this.services.navigation.resetAction();
      });
  }
}
