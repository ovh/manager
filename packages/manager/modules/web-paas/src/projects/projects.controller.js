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

  static getDetailsState(projectId) {
    return `web-paas.dashboard.service({ projectId: '${projectId}'})`;
  }

  static isAdmin(project) {
    return project.getAccountName() === this.user.nichandle;
  }
}
