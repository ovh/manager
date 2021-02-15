export default class WebPaasCtrl {
  /* @ngInject */
  constructor($translate, WebPaas, Alerter) {
    this.$translate = $translate;
    this.WebPaas = WebPaas;
    this.Alerter = Alerter;
    this.alerts = {
      list: 'web_paas_dashboard_list',
    };
  }

  getProjectDetails(projectId) {
    return this.WebPaas.getProjectDetails(projectId);
  }
}
