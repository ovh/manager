export default class WebPaasCtrl {
  /* @ngInject */
  constructor($translate, $scope, WebPaas, Alerter) {
    this.$translate = $translate;
    this.WebPaas = WebPaas;
    this.Alerter = Alerter;
    this.$scope = $scope;
    this.$scope.alerts = {
      list: 'web_paas_dashboard_list',
    };
  }

  getProjectDetails(projectId) {
    return this.WebPaas.getProjectDetails(projectId);
  }
}
