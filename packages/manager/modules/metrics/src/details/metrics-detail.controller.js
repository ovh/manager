import map from 'lodash/map';
import { graphs, protos, GUIDE } from './metrics.constant';

export default class MetricsDetailCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $scope,
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    MetricService,
    ovhDocUrl,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.serviceName = $stateParams.serviceName;
    this.MetricService = MetricService;
    this.service = {};
    this.loadingService = false;
    this.ovhDocUrl = ovhDocUrl;
    this.messages = [];
    this.graphs = graphs;
    this.protos = protos;
    this.URL = GUIDE.FR;

    this.serviceName = $stateParams.serviceName;
    this.guides = {};
  }

  $onInit() {
    this.initGuides();
    this.loadData();
    this.loadMessage();
    this.$scope.$on('changeDescription', (event, data) => {
      this.service.description = data;
    });
  }

  loadData() {
    this.loadingService = true;
    this.MetricService.getService(this.serviceName)
      .then((service) => {
        this.service = service.data;
      })
      .finally(() => {
        this.loadingService = false;
      });
  }

  loadMessage() {
    this.CucCloudMessage.unSubscribe('metrics.detail');
    this.messageHandler = this.CucCloudMessage.subscribe('metrics.detail', {
      onMessage: () => this.refreshMessage(),
    });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
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
