import isFunction from 'lodash/isFunction';

export default class NutanixNetworkTileController {
  /* @ngInject */
  constructor($http, coreURLBuilder, NutanixService) {
    this.$http = $http;
    this.coreURLBuilder = coreURLBuilder;
    this.NutanixService = NutanixService;
  }

  $onInit() {
    this.vrack = null;
    this.iplb = null;

    if (this.cluster.targetSpec.vrack) {
      this.loadingVrack = true;
      this.loadVrack(this.cluster.targetSpec.vrack)
        .then((res) => {
          this.vrack = res;
        })
        .finally(() => {
          this.loadingVrack = false;
        });
    }

    if (this.cluster.targetSpec.iplb) {
      this.loadingIpLb = true;
      this.loadIpLb(this.cluster.targetSpec.iplb)
        .then((res) => {
          this.iplb = res;
        })
        .finally(() => {
          this.loadingIpLb = false;
        });
    }

    this.loadingBandwidth = true;
    this.loadBandwidth()
      .then((res) => {
        this.specifications = res;
      })
      .finally(() => {
        this.loadingBandwidth = false;
      });

    this.loadingBandwidthOptions = true;
    this.loadBandwidthOptions()
      .then((res) => {
        this.bandwidthInformations = res;
      })
      .finally(() => {
        this.loadingBandwidthOptions = false;
      });
  }

  loadVrack(vRackServiceName) {
    return this.$http
      .get(`/vrack/${vRackServiceName}`)
      .then(({ data }) => ({
        serviceName: vRackServiceName,
        ...data,
      }))
      .catch((error) => {
        return this.handleError(error);
      });
  }

  loadIpLb(ipLbServiceName) {
    return this.$http
      .get(`/ipLoadbalancing/${ipLbServiceName}`)
      .then(({ data }) => ({
        serviceName: ipLbServiceName,
        ...data,
      }))
      .catch((error) => this.handleError(error));
  }

  loadBandwidth() {
    return this.NutanixService.getBandwidth(
      this.cluster.getFirstNode(),
    ).catch((error) => this.handleError(error));
  }

  loadBandwidthOptions() {
    return this.NutanixService.getBandwidthOptions(
      this.cluster.getFirstNode(),
    ).catch((error) => this.handleError(error));
  }

  getVrackUrl(vrackId) {
    return this.coreURLBuilder.buildURL('dedicated', '#/vrack/:serviceName', {
      serviceName: vrackId,
    });
  }

  getIpLbUrl(ipLbId) {
    return this.coreURLBuilder.buildURL('dedicated', '#/iplb/:serviceName', {
      serviceName: ipLbId,
    });
  }

  handleError(error) {
    if (isFunction(this.onError)) {
      this.onError({ error });
    }
  }
}
