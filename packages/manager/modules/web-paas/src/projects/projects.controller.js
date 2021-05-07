export default class WebPaasProjectsCtrl {
  /* @ngInject */
  constructor(WebPaas, CucRegionService) {
    this.WebPaas = WebPaas;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    this.alerts = {
      list: 'web_paas_dashboard_list',
    };
  }

  static getDetailsState(projectId) {
    return `web-paas.dashboard({ projectId: '${projectId}'})`;
  }
}
