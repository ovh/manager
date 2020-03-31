import map from 'lodash/map';
import { graphs, protos } from '../metrics.constant';
import { GUIDE } from './constants';

export default class MetricsHeaderCtrl {
  /* @ngInject */
  constructor($state, $stateParams, $translate, ovhDocUrl) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;

    this.ovhDocUrl = ovhDocUrl;
    this.graphs = graphs;
    this.protos = protos;
    this.URL = GUIDE.FR;

    this.serviceName = $stateParams.serviceName;
    this.guides = {};
  }

  $onInit() {
    this.initGuides();
  }

  initGuides() {
    this.guides.title = this.$translate.instant('metrics_guides');
    this.guides.footer = {
      name: this.$translate.instant('metrics_guides_footer'),
      url: this.URL,
      external: true,
    };
    this.guides.sections = [];
    this.guides.sections.push({
      title: this.$translate.instant('metrics_guides_first-step'),
      list: [
        {
          name: this.$translate.instant('metrics_guides_first-step_begin'),
          url: this.ovhDocUrl.getDocUrl('metrics'),
          external: true,
        },
      ],
    });
    this.guides.sections.push({
      title: this.$translate.instant('metrics_guides_protocoles'),
      list: this.getProtocolDocs(),
    });

    this.guides.sections.push({
      title: this.$translate.instant('metrics_guides_platform'),
      list: this.getPlatformDocs(),
    });
  }

  getProtocolDoc(proto) {
    const doc = this.ovhDocUrl.getDocUrl('cloud/metrics/using');
    return { name: proto, url: `${doc}/#${proto}`, external: true };
  }

  getProtocolDocs() {
    return map(this.protos, (proto) => this.getProtocolDoc(proto));
  }

  getPlatformDocs() {
    return map(this.graphs, (graph) => this.getPlatformDoc(graph.name));
  }

  getPlatformDoc(graph) {
    const doc = this.ovhDocUrl.getDocUrl('cloud/metrics/visualize');
    const anchor = graph.toLowerCase();
    return { name: graph, url: `${doc}/#${anchor}`, external: true };
  }
}
