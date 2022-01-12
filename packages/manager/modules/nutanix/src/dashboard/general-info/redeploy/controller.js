import {
  REDEPLOY_INITIAL_CONFIG,
  REDEPLOY_CUSTOM_CONFIG,
  PRISM_CENTRAL_TYPES,
  IPV4_REGEX,
  IPV4_BLOCK_REGEX,
  TRACKING_PREFIX,
} from './constants';

export default class NutanixGeneralInfoRedeployCtrl {
  /* @ngInject */
  constructor($translate, atInternet, Validator) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Validator = Validator;
    this.REDEPLOY_INITIAL_CONFIG = REDEPLOY_INITIAL_CONFIG;
    this.REDEPLOY_CUSTOM_CONFIG = REDEPLOY_CUSTOM_CONFIG;
    this.prismCentralTypes = PRISM_CENTRAL_TYPES;
    this.IPV4_REGEX = IPV4_REGEX;
    this.IPV4_BLOCK_REGEX = IPV4_BLOCK_REGEX;
  }

  $onInit() {
    this.initalConfig = angular.copy(this.cluster.targetSpec);
    this.displayPrismCentralIps = this.initalConfig.prismCentral.ips.join(',');
    this.redeployMethod = REDEPLOY_INITIAL_CONFIG;
    this.redeployMethods = {
      initialConfig: [REDEPLOY_INITIAL_CONFIG],
      customConfig: [REDEPLOY_CUSTOM_CONFIG],
    };
    this.initReplicationFactors();
  }

  initReplicationFactors() {
    this.replicationFactors = {};
    if (this.cluster.allowedRedundancyFactor.find((element) => element === 2)) {
      this.replicationFactors.rf2 = '2';
    }
    if (this.cluster.allowedRedundancyFactor.find((element) => element === 3)) {
      this.replicationFactors.rf3 = '3';
    }
  }

  trackClick(label) {
    this.atInternet.trackClick({
      type: 'action',
      name: `${TRACKING_PREFIX}::${label}`,
    });
  }

  addPrismCentralIp() {
    this.config.prismCentral.ips.push('');
  }

  removePrismCentralIp(index) {
    this.config.prismCentral.ips.splice(index, 1);
  }

  setRedundancyFactor(modelValue) {
    this.config.redundancyFactor = +modelValue;
  }

  onRedeployMethodSubmit() {
    if (this.redeployMethod === REDEPLOY_CUSTOM_CONFIG) {
      this.config = (({
        redundancyFactor,
        erasureCoding,
        prismCentral,
        prismElementVip,
        gatewayCidr,
        version,
      }) => ({
        redundancyFactor,
        erasureCoding,
        prismCentral,
        prismElementVip,
        gatewayCidr,
        version,
      }))(angular.copy(this.cluster.targetSpec));
      if (this.cluster.allowedRedundancyFactor.length === 1) {
        this.redundancyFactorValue = `${this.cluster.allowedRedundancyFactor[0]}`;
        this.config.redundancyFactor = +this.redundancyFactorValue;
      }
      if (this.config.prismCentral?.ips?.length === 0) {
        this.config.prismCentral.ips = [''];
      }
    }
  }

  static preparePayload({
    redundancyFactor,
    erasureCoding,
    prismCentral,
    prismElementVip,
    gatewayCidr,
    version,
  }) {
    return {
      erasureCoding,
      prismCentral: {
        ...(prismCentral.type && { type: prismCentral.type }),
        ...(prismCentral.vip && { vip: prismCentral.vip }),
        ips: prismCentral.ips.length > 0 ? prismCentral.ips : [],
      },
      ...(redundancyFactor && { redundancyFactor }),
      ...(prismElementVip && { prismElementVip }),
      ...(gatewayCidr && { gatewayCidr }),
      ...(version && { version }),
    };
  }

  onRedeploy() {
    this.trackClick(
      this.redeployMethod === REDEPLOY_CUSTOM_CONFIG
        ? 'confirm_personalized-configuration'
        : 'confirm_saved-configuration',
    );
    this.goToConfirmRedeploy(
      this.redeployMethod,
      NutanixGeneralInfoRedeployCtrl.preparePayload(
        this.redeployMethod === REDEPLOY_CUSTOM_CONFIG
          ? this.config
          : this.initalConfig,
      ),
    );
  }

  goToPreviousPage() {
    this.trackClick('cancel');
    this.goBack();
  }
}
