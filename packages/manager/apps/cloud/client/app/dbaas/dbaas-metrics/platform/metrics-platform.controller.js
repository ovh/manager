import map from 'lodash/map';

(() => {
  class MetricsPlatformCtrl {
    constructor(
      $stateParams,
      $translate,
      METRICS_ENDPOINTS,
      MetricService,
      ovhDocUrl,
    ) {
      this.$stateParams = $stateParams;
      this.serviceName = $stateParams.serviceName;
      this.$translate = $translate;
      this.METRICS_ENDPOINTS = METRICS_ENDPOINTS;
      this.MetricService = MetricService;
      this.ovhDocUrl = ovhDocUrl;

      this.platforms = [];
      this.regionName = '';

      this.loading = false;
    }

    $onInit() {
      this.loading = true;
      this.initPlatforms();
    }

    initPlatforms() {
      this.MetricService.getService(this.serviceName).then((service) => {
        this.regionName = service.data.region.name;
        this.platforms = map(this.METRICS_ENDPOINTS.protos, (proto) => ({
          proto,
          address: `https://${proto}.${this.regionName}.${this.METRICS_ENDPOINTS.suffix}`,
          doc: this.getDoc(proto),
        }));
        this.loading = false;
      });
    }

    getDoc(proto) {
      const doc = this.ovhDocUrl.getDocUrl('cloud/metrics/using');
      return `${doc}/#${proto}`;
    }
  }

  angular
    .module('managerApp')
    .controller('MetricsPlatformCtrl', MetricsPlatformCtrl);
})();
