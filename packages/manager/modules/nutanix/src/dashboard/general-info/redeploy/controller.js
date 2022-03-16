import cloneDeep from 'lodash/cloneDeep';
import {
  REDEPLOY_CONFIG_OPTIONS,
  PRISM_CENTRAL_TYPE_ALONE,
  PRISM_CENTRAL_TYPES,
  IPV4_REGEX,
  IPV4_BLOCK_REGEX,
  TRACKING_PREFIX,
  CLUSTER_CONFIG_TERMS,
} from './constants';

export default class NutanixGeneralInfoRedeployCtrl {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.REDEPLOY_CONFIG_OPTIONS = REDEPLOY_CONFIG_OPTIONS;
    this.PRISM_CENTRAL_TYPE_ALONE = PRISM_CENTRAL_TYPE_ALONE;
    this.prismCentralTypes = PRISM_CENTRAL_TYPES;
    this.IPV4_REGEX = IPV4_REGEX;
    this.IPV4_BLOCK_REGEX = IPV4_BLOCK_REGEX;
    this.CLUSTER_CONFIG_TERMS = CLUSTER_CONFIG_TERMS;
  }

  $onInit() {
    this.initalConfig = cloneDeep(this.cluster.targetSpec);
    this.displayPrismCentralIps = this.initalConfig.prismCentral.ips.join(',');
    this.redeployMethod = REDEPLOY_CONFIG_OPTIONS.INITIAL;
    this.redeployMethods = {
      initialConfig: [REDEPLOY_CONFIG_OPTIONS.INITIAL],
      customConfig: [REDEPLOY_CONFIG_OPTIONS.CUSTOM],
    };
    this.initReplicationFactors();
  }

  initReplicationFactors() {
    this.replicationFactors = this.cluster.allowedRedundancyFactor.map(
      (factor) => ({
        name: `rf${factor}`,
        factor,
        values: [`${factor}`],
      }),
    );
  }

  trackClick(label) {
    this.atInternet.trackClick({
      type: 'action',
      name: `${TRACKING_PREFIX}::${label}`,
    });
  }

  addEmptyIp(prismCentralType) {
    if (
      this.config.prismCentral?.ips?.length === 0 &&
      prismCentralType !== PRISM_CENTRAL_TYPE_ALONE
    ) {
      this.config.prismCentral.ips = [''];
    }
  }

  onPrismCentralTypeChange(modelValue) {
    this.config.prismCentral.ips =
      modelValue === PRISM_CENTRAL_TYPE_ALONE
        ? []
        : cloneDeep(this.cluster.targetSpec.prismCentral.ips);
    this.addEmptyIp(modelValue);
    return modelValue;
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
    if (this.redeployMethod === REDEPLOY_CONFIG_OPTIONS.CUSTOM) {
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
      }))(cloneDeep(this.cluster.targetSpec));
      if (this.cluster.allowedRedundancyFactor.length === 1) {
        this.redundancyFactorValue = `${this.cluster.allowedRedundancyFactor[0]}`;
        this.config.redundancyFactor = +this.redundancyFactorValue;
      }
      this.addEmptyIp(this.config.prismCentral.type);
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
      this.redeployMethod === REDEPLOY_CONFIG_OPTIONS.CUSTOM
        ? 'confirm_personalized-configuration'
        : 'confirm_saved-configuration',
    );
    this.goToConfirmRedeploy(
      this.redeployMethod,
      NutanixGeneralInfoRedeployCtrl.preparePayload(
        this.redeployMethod === REDEPLOY_CONFIG_OPTIONS.CUSTOM
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
