import map from 'lodash/map';

(() => {
  class MetricsHeaderCtrl {
    constructor(
      $state,
      $stateParams,
      $translate,
      ovhDocUrl,
      METRICS_ENDPOINTS,
      URLS,
    ) {
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$translate = $translate;

      this.ovhDocUrl = ovhDocUrl;

      this.METRICS_ENDPOINTS = METRICS_ENDPOINTS;
      this.URLS = URLS;

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
        url: this.URLS.guides.home.FR,
        external: true,
      };
      this.guides.sections = [];
      this.guides.sections.push({
        title: this.$translate.instant('metrics_guides_first-step'),
        list: [
          {
            name: this.$translate.instant('metrics_guides_first-step_begin'),
            url: this.ovhDocUrl.getDocUrl('metrics/start-opentsdb'),
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
      return map(this.METRICS_ENDPOINTS.protos, (proto) =>
        this.getProtocolDoc(proto),
      );
    }

    getPlatformDocs() {
      return map(this.METRICS_ENDPOINTS.graphs, (graph) =>
        this.getPlatformDoc(graph.name),
      );
    }

    getPlatformDoc(graph) {
      const doc = this.ovhDocUrl.getDocUrl('cloud/metrics/visualize');
      const anchor = graph.toLowerCase();
      return { name: graph, url: `${doc}/#${anchor}`, external: true };
    }
  }
  angular
    .module('managerApp')
    .controller('MetricsHeaderCtrl', MetricsHeaderCtrl);
})();
