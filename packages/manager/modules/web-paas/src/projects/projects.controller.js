export default class WebPaasProjectsCtrl {
  /* @ngInject */
  constructor(WebPaas) {
    this.WebPaas = WebPaas;
  }

  $onInit() {
    this.alerts = {
      list: 'web_paas_dashboard_list',
    };
  }

  // getProjectDetails(projectId) {
  //   return this.WebPaas.getProjectDetails(projectId);
  // }
}
