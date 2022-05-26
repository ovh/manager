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
    this.displayIpSubnetError = false;
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

  static getIpsList(config = {}) {
    return [
      config.prismElementVip,
      config.prismCentral?.vip,
      ...(config?.prismCentral?.ips && config.prismCentral.ips),
      ...(config.nodes?.length > 0 &&
        config.nodes.reduce((acc, item) => {
          acc.push(item.ahvIp);
          acc.push(item.cvmIp);
          return acc;
        }, [])),
    ];
  }

  checkIpsUniqueness() {
    if (this.config) {
      const IPs =
        NutanixGeneralInfoRedeployCtrl.getIpsList(this.config).filter(
          Boolean,
        ) || [];
      this.displayIpUniquenessError = IPs.length !== new Set(IPs).size;
      return !this.displayIpUniquenessError;
    }
    return true;
  }

  onGatewayCidrChange = (form) => {
    form.$$controls.forEach((element) => element.$validate());
  };

  displayIpSubnetErrorPrismCentralIpField = (form, index) => {
    return (
      form[`ip${index}`]?.$error.ipSubnetValidator &&
      form[`ip${index}`]?.$touched &&
      form[`ip${index}`]?.$dirty
    );
  };

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
        nodes,
      }) => ({
        redundancyFactor,
        erasureCoding,
        prismCentral,
        prismElementVip,
        gatewayCidr,
        version,
        nodes,
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
    nodes,
  }) {
    return {
      erasureCoding,
      prismCentral: {
        ...(prismCentral.type && { type: prismCentral.type }),
        ...(prismCentral.vip && { vip: prismCentral.vip }),
        ips: prismCentral.ips.length > 0 ? prismCentral.ips : [],
      },
      ...(nodes && {
        nodes: nodes.map(({ ahvIp, cvmIp }) => ({ ahvIp, cvmIp })),
      }),
      ...(redundancyFactor && { redundancyFactor }),
      ...(prismElementVip && { prismElementVip }),
      ...(gatewayCidr && { gatewayCidr }),
      ...(version && { version }),
    };
  }

  redeployInitialConfiguration() {
    this.trackClick('confirm_saved-configuration');
    delete this.initalConfig.nodes;
    return this.goToConfirmRedeploy(
      REDEPLOY_CONFIG_OPTIONS.INITIAL,
      NutanixGeneralInfoRedeployCtrl.preparePayload(this.initalConfig),
    );
  }

  redeployCustomConfiguration() {
    this.trackClick('confirm_personalized-configuration');
    return this.goToConfirmRedeploy(
      REDEPLOY_CONFIG_OPTIONS.CUSTOM,
      NutanixGeneralInfoRedeployCtrl.preparePayload(this.config),
    );
  }

  goToPreviousPage() {
    this.trackClick('cancel');
    this.goBack();
  }
}
