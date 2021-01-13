import map from 'lodash/map';
import { protos, suffix } from '../details/metrics.constant';

export default class MetricsPlatformCtrl {
  /* @ngInject */
  constructor($stateParams, $translate, MetricService, ovhDocUrl) {
    this.$stateParams = $stateParams;
    this.serviceName = $stateParams.serviceName;
    this.$translate = $translate;
    this.MetricService = MetricService;
    this.ovhDocUrl = ovhDocUrl;
    this.protos = protos;
    this.suffix = suffix;

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
      this.platforms = map(this.protos, (proto) => ({
        proto,
        address: `https://${proto}.${this.regionName}.${this.suffix}`,
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
